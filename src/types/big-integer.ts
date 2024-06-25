import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'BIGINT',
	mysql: 'BIGINT',
	websql: 'BIGINT',
	odata: {
		name: 'Edm.Int64',
	},
};

export type Types = TypeUtils.TsTypes<string, string | number | bigint>;
type DbWriteType = bigint;

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return data;
	}
	let value: string;
	if (typeof data === 'string') {
		value = data;
	} else if (typeof data === 'bigint' || typeof data === 'number') {
		value = data.toString();
	} else {
		throw new Error('Fetched bigint is not valid: ' + typeof data);
	}
	return value;
};

export const nativeFactTypes: TypeUtils.NativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.bigint;
