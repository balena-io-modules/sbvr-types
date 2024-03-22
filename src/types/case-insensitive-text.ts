import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'CITEXT',
	mysql: 'TEXT COLLATE utf8_unicode_ci',
	websql: 'TEXT COLLATE NOCASE',
	odata: {
		name: 'Edm.String',
	},
};

export type Types = TypeUtils.TsTypes<string, string>;
type DbWriteType = string;

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.text();
