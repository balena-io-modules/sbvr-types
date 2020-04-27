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
	if (Number.isNaN(processedValue)) {
		throw new Error('is not a number: ' + value);
	} else {
		return processedValue;
	}
});
