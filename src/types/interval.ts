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

// Postgres stores an INTERVAL, which isn't limited to the range of an INTEGER
export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.safeInteger;

export const schema = TypeUtils.schema.safeInteger;
