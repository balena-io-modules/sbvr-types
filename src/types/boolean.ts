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

// `BOOLEAN` on sqlite/websql is just an alias for `INTEGER` hence the `=== 1` check
export const fetchProcessing = (data: any) => data === true || data === 1;

export const validate = TypeUtils.validate.checkRequired((originalValue) => {
	// We use Number rather than parseInt as it deals with booleans and will return NaN for things like "a1"
	const value = Number(originalValue);
	if (Number.isNaN(value) || ![0, 1].includes(value)) {
		throw new Error(
			`is not a boolean: ${JSON.stringify(
				originalValue,
			)} (${typeof originalValue})`,
		);
	}
	return value === 1;
});
