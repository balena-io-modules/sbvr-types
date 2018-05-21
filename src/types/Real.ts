import * as TypeUtils from '../TypeUtils';
import * as _ from 'lodash';

export const Real: SBVRType<number, any> = {
	types: {
		postgres: 'REAL',
		mysql: 'REAL',
		websql: 'REAL',
		odata: {
			name: 'Edm.Double',
		},
	},

	nativeFactTypes: {
		Integer: TypeUtils.nativeFactTypeTemplates.comparison,
		Real: TypeUtils.nativeFactTypeTemplates.comparison,
	},

	validate: TypeUtils.validate.whenNotNull((value, required, callback) => {
		const processedValue = parseFloat(value);
		if (_.isNaN(processedValue)) {
			callback('is not a number: ' + value);
		} else {
			callback(null, processedValue);
		}
	}),
};
