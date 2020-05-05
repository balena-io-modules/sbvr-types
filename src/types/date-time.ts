import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TIMESTAMP',
	mysql: 'TIMESTAMP',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

export const fetchProcessing = async (data: any) => {
	if (data != null) {
		return new Date(data);
	}
	return data;
};

export const validate = TypeUtils.validate.date;
