import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'DATE',
	mysql: 'DATE',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

export const fetchProcessing = (data: any) => {
	if (data == null) {
		return data;
	}
	if (!(data instanceof Date)) {
		data = new Date(data);
	}
	return data.toISOString();
};

export const nativeFactTypes = {
	Date: {
		...TypeUtils.nativeFactTypeTemplates.equality,
		'is before': (from: string, to: string) => ['LessThan', from, to],
	},
};

export const validate = TypeUtils.validate.date;
