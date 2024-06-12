import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'BIGINT',
	mysql: 'BIGINT',
	websql: 'BIGINT',
	odata: {
		name: 'Edm.Int64',
	},
};

export type Types = TypeUtils.TsTypes<bigint, number | bigint>;
type DbWriteType = bigint;

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return data;
	}
	let value: bigint;
	if (typeof data === 'bigint') {
		value = data;
	} else if (typeof data === 'string' || typeof data === 'number') {
		value = BigInt(data);
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
