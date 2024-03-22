import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTEGER',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.Int32',
	},
};

export type Types = TypeUtils.TsTypes<number, number>;
type DbWriteType = number;

export const nativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.integer;
