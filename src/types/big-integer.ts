import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'BIGINT',
	mysql: 'BIGINT',
	websql: 'BIGINT',
	odata: {
		name: 'Edm.Int64',
	},
};

type WriteType = number;
type DbWriteType = number;

export const nativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate: TypeUtils.Validate<WriteType, DbWriteType> =
	TypeUtils.validate.integer;
