import * as _Promise from 'bluebird';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'CITEXT',
	mysql: 'TEXT COLLATE utf8_unicode_ci',
	websql: 'TEXT COLLATE NOCASE',
	odata: {
		name: 'Edm.String',
	},
};

export const validate = TypeUtils.validate.text();
