import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'VARCHAR(255)',
	mysql: 'VARCHAR(255)',
	websql: 'VARCHAR(255)',
	odata: {
		name: 'Edm.String',
	},
};

type WriteType = string;
type DbWriteType = string;

export const validate: TypeUtils.Validate<WriteType, DbWriteType> =
	TypeUtils.validate.text(255);
