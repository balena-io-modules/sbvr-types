import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTERVAL',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.Int64',
	},
};

export const validate = TypeUtils.validate.integer;
