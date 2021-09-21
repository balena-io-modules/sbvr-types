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
	if (data == null || data instanceof Date) {
		return data;
	}
	return new Date(data);
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

export const validate = TypeUtils.validate.date;
