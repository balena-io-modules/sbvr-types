import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TIMESTAMP',
	mysql: 'TIMESTAMP',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

type ReadType = string;
type WriteType = string | number;
type DbWriteType = Date;

export const fetchProcessing: TypeUtils.FetchProcessing<ReadType> = (data) => {
	if (data == null) {
		return data;
	}
	let date: Date;
	if (data instanceof Date) {
		date = data;
	} else if (typeof data === 'string' || typeof data === 'number') {
		date = new Date(data);
	} else {
		throw new Error('Fetched date time is not valid: ' + typeof data);
	}
	return date.toISOString();
};

export const nativeFactTypes = {
	'Date Time': {
		...TypeUtils.nativeFactTypeTemplates.equality,
		'is before': (from: string, to: string) => ['LessThan', from, to],
	},
};

export const nativeNames = {
	'Current Time': ['Now'],
};

export const validate: TypeUtils.Validate<WriteType, DbWriteType> =
	TypeUtils.validate.date;
