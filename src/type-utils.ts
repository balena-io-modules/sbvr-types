import type {
	AnyTypeNodes,
	EqualsNode,
	LessThanNode,
	LessThanOrEqualNode,
	ReferencedFieldNode,
} from '@balena/abstract-sql-compiler' with { 'resolution-mode': 'import' };
import z from 'zod';

export type NativeNames = Record<string, AnyTypeNodes>;
export type NativeProperties = Record<
	string,
	Record<string, (from: ReferencedFieldNode) => AnyTypeNodes>
>;
export type NativeFactTypes = Record<
	string,
	Record<
		string,
		(from: ReferencedFieldNode, to: ReferencedFieldNode) => AnyTypeNodes
	>
>;

export interface DatabaseTypeFn {
	(necessity: string, index: string, defaultValue?: string): string;
	castType: string;
}
export type DatabaseType = string | DatabaseTypeFn;
export interface SbvrType<Read = unknown, Write = any, DbWrite = unknown> {
	types: {
		odata: {
			name: string;
			complexType?: string;
		};
		postgres: DatabaseType;
		mysql: DatabaseType;
		websql: DatabaseType;
	};
	fetchProcessing?: FetchProcessing<Read>;
	validate: Validate<Write, DbWrite>;
	schema: z.ZodType;
	nativeProperties?: NativeProperties;
	nativeFactTypes?: NativeFactTypes;
	nativeNames?: NativeNames;
}
export interface TsTypes<Read, Write> {
	Read: Read;
	Write: Write;
}

export type FetchProcessing<Read> = (data: unknown) => Read | null | undefined;
export interface Validate<Write, DbWrite> {
	(value: Write, required: true): Promise<DbWrite>;
	(value: Write, required: false): Promise<DbWrite | null>;
	(value: Write, required: boolean): Promise<DbWrite | null>;
}

const checkRequired = <T>(validateFn: (value: any) => T | Promise<T>) => {
	function runCheck(value: unknown, required: true): Promise<T>;
	function runCheck(value: undefined | null, required: false): Promise<null>;
	function runCheck(value: unknown, required: boolean): Promise<T | null>;
	async function runCheck(
		value: unknown,
		required: boolean,
	): Promise<T | null> {
		if (value == null) {
			if (required) {
				throw new Error('cannot be null');
			}
			return null;
		}
		return validateFn(value);
	}
	return runCheck;
};

// Creates a validate function that accepts exactly what the schema accepts, returning the schema's output.
// Pass a compiled schema (as all of the exported ones are), since validate runs for every value
const fromSchema = <T>(
	zodSchema: z.ZodType<T>,
	errorMessage: (value: unknown) => string,
) =>
	checkRequired((value) => {
		const result = zodSchema.safeParse(value);
		if (!result.success) {
			throw new Error(errorMessage(value));
		}
		return result.data;
	});

const equality = {
	'is equal to': (from, to): EqualsNode => ['Equals', from, to],
} satisfies NativeFactTypes[string];
export const nativeFactTypeTemplates = {
	equality,
	comparison: {
		'is less than': (from, to): LessThanNode => ['LessThan', from, to],
		'is less than or equal to': (from, to): LessThanOrEqualNode => [
			'LessThanOrEqual',
			from,
			to,
		],
		...equality,
	},
} satisfies Record<string, NativeFactTypes[string]>;

// Strings are only accepted if they are entirely an integer, with no fractional part, exponent or trailing text.
// The number of significant digits is limited to what the type can hold, so that converting a long string
// (which is slow for `BigInt`) is never attempted
const integerString = /^[+-]?0*\d{1,16}$/;
const bigintString = /^[+-]?0*\d{1,19}$/;
// An integer, or a string of one, from `min` to `max`. `z.int()` only allows safe integers, so numbers and
// strings that would lose precision are rejected too
export const integerInRange = (min: number, max: number) => {
	const integer = z.int().min(min).max(max);
	return z.union([
		integer,
		z.string().regex(integerString).transform(Number).pipe(integer),
	]);
};
// The range of an INTEGER on all the databases
const minInteger = -(2 ** 31);
const maxInteger = 2 ** 31 - 1;
// The schemas are compiled once at import (`z.compile` falls back to zod's runtime parser for anything it
// can't compile), so that every user of them gets the compiled fast path
export const schema = {
	// For INTEGER columns
	integer: z.compile(integerInRange(minInteger, maxInteger)),
	// For integers that aren't stored in an INTEGER column, eg Interval's seconds
	safeInteger: z.compile(
		integerInRange(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
	),
	bigint: z.compile(
		z
			.union([
				z.bigint(),
				z.int().transform(BigInt),
				z.string().regex(bigintString).transform(BigInt),
			])
			// The range of a BIGINT on all the databases
			.pipe(
				z
					.bigint()
					.min(-(2n ** 63n))
					.max(2n ** 63n - 1n),
			),
	),
	text: z.compile(z.string()),
	date: z.compile(
		z
			// A blank string would otherwise be treated as `0`, ie the epoch
			.union([z.string().trim().min(1), z.number(), z.date()])
			.transform((v) => {
				let processedValue: typeof v = Number(v);
				if (Number.isNaN(processedValue)) {
					processedValue = v;
				}
				const processedDate = new Date(processedValue);
				if (Number.isNaN(processedDate.getTime())) {
					return v;
				}
				return processedDate;
			})
			.pipe(z.date()),
	),
};

export const validate = {
	checkRequired,
	fromSchema,
	integer: fromSchema(schema.integer, (value) =>
		schema.safeInteger.safeParse(value).success
			? `is outside the integer range (${minInteger} to ${maxInteger}): ${String(value)}`
			: 'is not an integer: ' + String(value),
	),
	safeInteger: fromSchema(
		schema.safeInteger,
		(value) => 'is not an integer: ' + String(value),
	),
	bigint: fromSchema(
		schema.bigint,
		(value) => 'is not a big integer: ' + String(value),
	),
	text: (length?: number) =>
		checkRequired((value) => {
			if (typeof value !== 'string') {
				throw new Error('is not a string: ' + value);
			}
			// Count characters rather than UTF-16 code units, as the databases and zod's `.max()` do
			if (length != null && value.length > length) {
				const valueLength = z.util.codePointLength(value);
				if (valueLength > length) {
					throw new Error(
						'longer than ' + length + ' characters (' + valueLength + ')',
					);
				}
			}
			return value;
		}),
	date: fromSchema(
		schema.date,
		(value) => 'is not a valid date: ' + String(value),
	),
};
