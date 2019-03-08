import * as _Promise from 'bluebird';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'SERIAL',
	mysql: (necessity: string, index: string, defaultValue = '') =>
		'INTEGER' + defaultValue + necessity + index + ' AUTO_INCREMENT',
	websql: (necessity: string, index: string, defaultValue = '') =>
		'INTEGER' + defaultValue + necessity + index + ' AUTOINCREMENT',
	odata: {
		name: 'Edm.Int64',
	},
};

export const validate = TypeUtils.validate.integer;
