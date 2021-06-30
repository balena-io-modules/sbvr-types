import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TSRANGE',
	mysql: 'TEXT',
	websql: 'TEXT',
	odata: {
		name: 'Edm.String',
	},
};

export interface TSRange {
	lowerInclusive: boolean;
	lowerDate?: Date;
	upperDate?: Date;
	upperInclusive: boolean;
}

const regex = /(\[|\()(?:"((?:\\"|[^"])*)"|[^"]*),(?:"((?:\\"|[^"])*)"|[^"]*)(\]|\))/;

export async function fetchProcessing(data: null | undefined): Promise<null>;
export async function fetchProcessing(data: any): Promise<TSRange>;
export async function fetchProcessing(data: any): Promise<null | TSRange> {
	if (data == null) {
		return data;
	}

	const match = regex.exec(data);
	if (!match) {
		throw new Error(`Invalid date time range: '${data}`);
	}

	const [, lowerBound, lowerDate, upperDate, upperBound] = match;
	return {
		lowerInclusive: lowerBound === '[',
		lowerDate: lowerDate == null ? undefined : new Date(lowerDate),
		upperDate: upperDate == null ? undefined : new Date(upperDate),
		upperInclusive: upperBound === ']',
	};
}

export const validate = TypeUtils.validate.checkRequired(async value => {
	let rangeObj: TSRange;
	if (value == null) {
		rangeObj = value;
	} else if (typeof value === 'string') {
		rangeObj = await fetchProcessing(value);
	} else if (typeof value === 'object') {
		rangeObj = value;
	} else {
		throw new Error('is neither a string or date time range object: ' + value);
	}
	const lowerBound = rangeObj.lowerInclusive ? '[' : '(';
	const upperBound = rangeObj.upperInclusive ? ']' : ')';
	const lowerDate = rangeObj.lowerDate?.toISOString() ?? '';
	const upperDate = rangeObj.upperDate?.toISOString() ?? '';
	return `${lowerBound}"${lowerDate}","${upperDate}"${upperBound}`;
});
