import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'CITEXT',
	mysql: 'TEXT COLLATE utf8_unicode_ci',
	websql: 'TEXT COLLATE NOCASE',
	odata: {
		name: 'Edm.String',
	},
};

type WriteType = string;
type DbWriteType = string;

export const validate: TypeUtils.Validate<WriteType, DbWriteType> =
	TypeUtils.validate.text();
