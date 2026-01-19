import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TSTZRANGE',
	mysql: 'TEXT',
	websql: 'TEXT',
	odata: {
		name: 'Edm.String',
	},
};

/**
 * Represents a timestamp with timezone range
 * Read: Parsed range object or null for empty ranges
 * Write: PostgreSQL range string or object with bounds
 */
export interface TstzrangeType {
	lower: string;
	upper: string | null;
	lowerInclusive: boolean;
	upperInclusive: boolean;
}

export type Types = TypeUtils.TsTypes<
	TstzrangeType | null,
	| string
	| {
			lower: string | number | Date;
			upper?: string | number | Date | null;
			lowerInclusive?: boolean;
			upperInclusive?: boolean;
	  }
>;
type DbWriteType = string;

const parseRange = (rangeStr: string): TstzrangeType | null => {
	if (rangeStr === 'empty') {
		return null;
	}

	const match = rangeStr.match(/^([[(])([^,]*),([^)\]]*)?([)\]])$/);
	if (!match) {
		throw new Error(
			`Invalid tstzrange format: ${rangeStr}. Expected format like '[2024-01-01T00:00:00Z,2024-12-31T23:59:59Z)' or 'empty'`,
		);
	}

	const [, lowerBracket, lowerValue, upperValue, upperBracket] = match;

	if (!lowerValue || lowerValue.trim() === '') {
		throw new Error('tstzrange lower bound cannot be empty');
	}
	const lowerDate = new Date(lowerValue);
	if (Number.isNaN(lowerDate.getTime())) {
		throw new Error(`Invalid lower bound timestamp: ${lowerValue}`);
	}

	let upper: string | null = null;
	if (upperValue && upperValue.trim() !== '') {
		const upperDate = new Date(upperValue);
		if (Number.isNaN(upperDate.getTime())) {
			throw new Error(`Invalid upper bound timestamp: ${upperValue}`);
		}
		upper = upperDate.toISOString();
	}

	return {
		lower: lowerDate.toISOString(),
		upper,
		lowerInclusive: lowerBracket === '[',
		upperInclusive: upperBracket === ']',
	};
};

const formatRange = (range: TstzrangeType): string => {
	const lowerBracket = range.lowerInclusive ? '[' : '(';
	const upperBracket = range.upperInclusive ? ']' : ')';

	const lower = new Date(range.lower).toISOString();
	const upper = range.upper ? new Date(range.upper).toISOString() : '';

	return `${lowerBracket}${lower},${upper}${upperBracket}`;
};

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return data;
	}
	if (typeof data !== 'string') {
		throw new Error('Fetched tstzrange must be a string, got: ' + typeof data);
	}
	return parseRange(data);
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired((value) => {
		if (typeof value === 'string') {
			const parsed = parseRange(value);
			return parsed === null ? 'empty' : formatRange(parsed);
		}

		if (typeof value === 'object' && value !== null) {
			const { lower, upper, lowerInclusive, upperInclusive } = value;

			if (lower == null) {
				throw new Error('tstzrange must have a lower bound');
			}

			const lowerDate = new Date(lower);
			if (Number.isNaN(lowerDate.getTime())) {
				throw new Error(`Invalid lower bound: ${lower}`);
			}

			let upperDate: Date | null = null;
			if (upper != null) {
				upperDate = new Date(upper);
				if (Number.isNaN(upperDate.getTime())) {
					throw new Error(`Invalid upper bound: ${upper}`);
				}
			}

			const rangeObj: TstzrangeType = {
				lower: lowerDate.toISOString(),
				upper: upperDate ? upperDate.toISOString() : null,
				lowerInclusive: lowerInclusive ?? true,
				upperInclusive: upperInclusive ?? false,
			};

			return formatRange(rangeObj);
		}

		throw new Error(
			'Invalid tstzrange: expected string or object, got ' + typeof value,
		);
	});
