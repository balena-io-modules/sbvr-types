import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TIMESTAMP',
	mysql: 'TIMESTAMP',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

export const fetchProcessing = (data: any) => {
	if (data != null) {
		return new Date(data);
	}
	return data;
};

export const nativeFactTypes = {
	'Date Time': {
		...TypeUtils.nativeFactTypeTemplates.equality,
		'is before': (from: string, to: string) => ['LessThan', from, to],
		'is after': (from: string, to: string) => ['GreaterThan', from, to],
	},
};

export const nativeNames = {
	'Current Time': ['Now'],
};

export const validate = TypeUtils.validate.date;
