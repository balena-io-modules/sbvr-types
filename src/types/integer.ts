import * as _Promise from 'bluebird';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTEGER',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.Int32',
	},
};

export const nativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate = TypeUtils.validate.integer;
