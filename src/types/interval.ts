import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTERVAL',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.Int64',
	},
};

type WriteType = number;
type DbWriteType = number;

export const validate: TypeUtils.Validate<WriteType, DbWriteType> =
	TypeUtils.validate.integer;
