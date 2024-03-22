import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTERVAL',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.Int64',
	},
};

export type Types = TypeUtils.TsTypes<number, number>;
type DbWriteType = number;

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.integer;
