import * as TypeUtils from '../type-utils';
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
	lowerDate: string | null;
	upperDate: string | null;
	upperInclusive: boolean;
};

export type DateTimeRange = 'empty' | DateTimeRangeObject;

export type Types = TypeUtils.TsTypes<
	DateTimeRange,
	| 'empty'
	| {
			lowerInclusive: boolean;
			lowerDate: string | number | Date | null;
			upperDate: string | number | Date | null;
			upperInclusive: boolean;
	  }
>;
type DbWriteType = string;

// Regex handles PostgreSQL pg package format with quoted values (e.g., '["2024-01-01 00:00:00.123+00","2024-12-31 23:59:59+00")')
const rangeRegexp =
	/^(?<lowerBracket>[[(])(?:"(?<lowerValue>[^",]+)")?,(?:"(?<upperValue>[^",]+)")?(?<upperBracket>[)\]])$/;

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

	let lowerDate: string | null = null;
	if (lowerValue != null && lowerValue !== '') {
		try {
			lowerDate = date.fetchProcessing(lowerValue)!;
		} catch {
			throw new Error(`Invalid lower bound timestamp: ${lowerValue}`);
		}
	}

	let upperDate: string | null = null;
	if (upperValue != null && upperValue !== '') {
		try {
			upperDate = date.fetchProcessing(upperValue)!;
		} catch {
			throw new Error(`Invalid upper bound timestamp: ${upperValue}`);
		}
	}

	return {
		lowerDate,
		upperDate,
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
