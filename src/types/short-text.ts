import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'VARCHAR(255)',
	mysql: 'VARCHAR(255)',
	websql: 'VARCHAR(255)',
	odata: {
		name: 'Edm.String',
	},
};

export type Types = TypeUtils.TsTypes<string, string>;
type DbWriteType = string;

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.text(255);
