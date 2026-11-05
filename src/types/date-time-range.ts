import * as TypeUtils from '../type-utils';
import z from 'zod';
import * as date from './date';

export const types = {
	postgres: 'TSTZRANGE',
	mysql: 'TEXT',
	websql: 'TEXT',
	odata: {
		name: 'Edm.String',
	},
};

type DateTimeRangeObject = {
	lowerInclusive: boolean;
	lowerDate?: string;
	upperDate?: string;
	upperInclusive: boolean;
};

export type DateTimeRange = 'empty' | DateTimeRangeObject;

export type Types = TypeUtils.TsTypes<
	DateTimeRange,
	| 'empty'
	| {
			lowerInclusive: boolean;
			lowerDate?: string | number | Date | null;
			upperDate?: string | number | Date | null;
			upperInclusive: boolean;
	  }
>;
type DbWriteType = string;

// Regex handles PostgreSQL pg package format with quoted values (e.g., '["2024-01-01 00:00:00.123+00","2024-12-31 23:59:59+00")'),
// as well as unquoted values, which is how PostgreSQL outputs infinite bounds (e.g., '["2024-01-01 00:00:00+00",infinity)')
// and how `validate` formats ranges, which mysql/websql store as is (e.g., '[2024-01-01T00:00:00.000Z,)')
const rangeRegexp =
	/^(?<lowerBracket>[[(])"?(?<lowerValue>[^",]*)"?,"?(?<upperValue>[^",]*)"?(?<upperBracket>[)\]])$/;

/**
 * Reads a `-infinity` lower or `infinity` upper bound as unbounded. Other infinite bounds (eg Postgres'
 * `[infinity,infinity]`) can't be represented by the read type, so reading them throws. `validate` doesn't
 * accept infinite bounds, so they can only be written with raw SQL.
 */
export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return null;
	}
	if (typeof data !== 'string') {
		throw new Error('Fetched tstzrange must be a string, got: ' + typeof data);
	}

	if (data === 'empty') {
		return 'empty';
	}

	const matchGroups = data.match(rangeRegexp)?.groups;
	if (matchGroups == null) {
		throw new Error(
			`Invalid tstzrange format: ${data}. Expected format like '[2024-01-01T00:00:00Z,2024-12-31T23:59:59Z)' or 'empty'`,
		);
	}

	const { lowerBracket, lowerValue, upperValue, upperBracket } = matchGroups;
	if (lowerValue === 'infinity' || upperValue === '-infinity') {
		throw new Error(
			`Unsupported infinite bound in tstzrange: ${data}. Only a -infinity lower bound and an infinity upper bound are supported`,
		);
	}

	let lowerDate: string | undefined;
	if (lowerValue != null && lowerValue !== '' && lowerValue !== '-infinity') {
		try {
			lowerDate = date.fetchProcessing(lowerValue)!;
		} catch {
			throw new Error(`Invalid lower bound timestamp: ${lowerValue}`);
		}
	}

	let upperDate: string | undefined;
	if (upperValue != null && upperValue !== '' && upperValue !== 'infinity') {
		try {
			upperDate = date.fetchProcessing(upperValue)!;
		} catch {
			throw new Error(`Invalid upper bound timestamp: ${upperValue}`);
		}
	}

	return {
		...(lowerDate !== undefined && { lowerDate }),
		...(upperDate !== undefined && { upperDate }),
		lowerInclusive: lowerBracket === '[',
		upperInclusive: upperBracket === ']',
	};
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired(async (value) => {
		if (value === 'empty') {
			return value;
		}
		if (typeof value === 'object' && value != null) {
			const {
				lowerDate: lowerDateInput,
				upperDate: upperDateInput,
				lowerInclusive,
				upperInclusive,
			} = value as Extract<Types['Write'], object>;

			let lowerDate: Date | null;
			let upperDate: Date | null;
			try {
				lowerDate = await TypeUtils.validate.date(lowerDateInput, false);
			} catch {
				throw new Error(`Invalid lowerDate bound: ${lowerDateInput}`);
			}
			try {
				upperDate = await TypeUtils.validate.date(upperDateInput, false);
			} catch {
				throw new Error(`Invalid upperDate bound: ${upperDateInput}`);
			}

			if (typeof lowerInclusive !== 'boolean') {
				throw new Error(`lowerInclusive is required and must be a boolean`);
			}
			if (typeof upperInclusive !== 'boolean') {
				throw new Error(`upperInclusive is required and must be a boolean`);
			}

			const lowerBracket = lowerInclusive ? '[' : '(';
			const upperBracket = upperInclusive ? ']' : ')';
			const lower = lowerDate != null ? lowerDate.toISOString() : '';
			const upper = upperDate != null ? upperDate.toISOString() : '';
			return `${lowerBracket}${lower},${upper}${upperBracket}`;
		}

		throw new Error(
			"Invalid tstzrange: expected 'empty' or object, got " + typeof value,
		);
	});

export const schema = z.compile(
	z.union([
		z.literal('empty'),
		z.strictObject({
			lowerInclusive: z.boolean(),
			lowerDate: TypeUtils.schema.date.nullish(),
			upperInclusive: z.boolean(),
			upperDate: TypeUtils.schema.date.nullish(),
		}),
	]),
);
