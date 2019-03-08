import * as _Promise from 'bluebird';
import * as _ from 'lodash';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'REAL',
	mysql: 'REAL',
	websql: 'REAL',
	odata: {
		name: 'Edm.Double',
	},
};

export const nativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate = TypeUtils.validate.checkRequired(value => {
	const processedValue = parseFloat(value);
	if (_.isNaN(processedValue)) {
		throw new Error('is not a number: ' + value);
	} else {
		return processedValue;
	}
});
