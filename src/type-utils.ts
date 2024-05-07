import type {
	AnyTypeNodes,
	EqualsNode,
	LessThanNode,
	LessThanOrEqualNode,
	ReferencedFieldNode,
} from '@balena/abstract-sql-compiler';

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
	(necessity: string, index: string): string;
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

export const validate = {
	checkRequired,
	integer: checkRequired((value) => {
		const processedValue = parseInt(value, 10);
		if (Number.isNaN(processedValue)) {
			throw new Error('is not a number: ' + value);
		}
		return processedValue;
	}),
	bigint: checkRequired((value) => {
		if (value === '') {
			throw new Error('Cannot convert empty string to a BigInt');
		}
		return BigInt(value);
	}),
	text: (length?: number) =>
		checkRequired((value) => {
			if (typeof value !== 'string') {
				throw new Error('is not a string: ' + value);
			}
			if (length != null && value.length > length) {
				throw new Error(
					'longer than ' + length + ' characters (' + value.length + ')',
				);
			}
			return value;
		}),
	date: checkRequired((value) => {
		let processedValue = Number(value);
		if (Number.isNaN(processedValue)) {
			processedValue = value;
		}
		const processedDate = new Date(processedValue);
		if (Number.isNaN(processedDate.getTime())) {
			throw new Error('is not a valid date: ' + value);
		}
		return processedDate;
	}),
};
