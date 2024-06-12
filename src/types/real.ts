import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'REAL',
	mysql: 'REAL',
	websql: 'REAL',
	odata: {
		name: 'Edm.Double',
	},
};

export type Types = TypeUtils.TsTypes<number, number>;
type DbWriteType = number;

export const nativeFactTypes: TypeUtils.NativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired((value) => {
		const processedValue = parseFloat(value);
		if (Number.isNaN(processedValue)) {
			throw new Error('is not a number: ' + value);
		}
		return processedValue;
	});
