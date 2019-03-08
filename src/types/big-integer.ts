import * as _Promise from 'bluebird';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'BIGINT',
	mysql: 'BIGINT',
	websql: 'BIGINT',
	odata: {
		name: 'Edm.Int64',
	},
};

export const nativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate = TypeUtils.validate.integer;
