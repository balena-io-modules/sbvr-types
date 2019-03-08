import * as _Promise from 'bluebird';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'VARCHAR(255)',
	mysql: 'VARCHAR(255)',
	websql: 'VARCHAR(255)',
	odata: {
		name: 'Edm.String',
	},
};

export const validate = TypeUtils.validate.text(255);
