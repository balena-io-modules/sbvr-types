import z from 'zod';
import * as TypeUtils from '../type-utils';

const typeFunc: TypeUtils.DatabaseTypeFn = (
	necessity: string,
	index: string,
	defaultValue = ' DEFAULT FALSE',
) => 'BOOLEAN' + defaultValue + necessity + index;
typeFunc.castType = 'BOOLEAN';

export const types = {
	postgres: typeFunc,
	mysql: typeFunc,
	websql: typeFunc,
	odata: {
		name: 'Edm.Boolean',
	},
};

export type Types = TypeUtils.TsTypes<boolean, boolean | 0 | 1>;
type DbWriteType = boolean;

// `BOOLEAN` on sqlite/websql is just an alias for `INTEGER` hence the `=== 1` check
export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return data;
	}
	return data === true || data === 1;
};

export const schema = z.compile(
	z.preprocess((v) => {
		switch (v) {
			case 0:
			case '0':
				return false;
			case 1:
			case '1':
				return true;
		}
		return v;
	}, z.boolean()),
);

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.fromSchema(schema, (originalValue) => {
		let value: string | undefined;
		try {
			value = JSON.stringify(originalValue);
		} catch {
			// eg a bigint
			value = String(originalValue);
		}
		return `is not a boolean: ${value} (${typeof originalValue})`;
	});
