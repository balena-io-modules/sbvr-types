import * as TypeUtils from '../type-utils';

const mysqlType: TypeUtils.DatabaseTypeFn = (
	necessity: string,
	index: string,
	defaultValue = '',
) => 'BIGINT' + defaultValue + necessity + index + ' AUTO_INCREMENT';
mysqlType.castType = 'BIGINT';

const websqlType: TypeUtils.DatabaseTypeFn = (
	necessity: string,
	index: string,
	defaultValue = '',
) => 'INTEGER' + defaultValue + necessity + index + ' AUTOINCREMENT';
websqlType.castType = 'INTEGER';

export const types = {
	postgres: 'BIGSERIAL',
	mysql: mysqlType,
	websql: websqlType,
	odata: {
		name: 'Edm.Int64',
	},
};

export const fetchProcessing = (data: any) => {
	if (data == null) {
		return data;
	}
	return BigInt(data);
};

export const validate = TypeUtils.validate.bigint;
