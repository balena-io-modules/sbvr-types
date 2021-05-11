import * as TypeUtils from '../type-utils';

const typeFunc: TypeUtils.DatabaseTypeFn = (
	necessity: string,
	index: string,
	defaultValue = ' DEFAULT 0',
) => 'INTEGER' + defaultValue + necessity + index;
typeFunc.castType = 'INTEGER';

export const types = {
	postgres: typeFunc,
	mysql: typeFunc,
	websql: typeFunc,
	odata: {
		name: 'Edm.Boolean',
	},
};

// Support both `1` from the "boolean" columns that are actually INTEGER types and `true` for truly boolean results
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
	return value;
});
