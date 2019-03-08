import * as Promise from 'bluebird';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TIMESTAMP',
	mysql: 'TIMESTAMP',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

export const fetchProcessing = Promise.method((data: any) => {
	if (data != null) {
		return new Date(data);
	}
	return data;
});

export const validate = TypeUtils.validate.date;
