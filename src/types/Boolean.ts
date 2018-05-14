import * as _ from 'lodash';

const typeFunc = (necessity: string, index: string, defaultValue: string = ' DEFAULT 0') => {
	return 'INTEGER' + defaultValue + necessity + index;
};

export const SBVRBoolean: SBVRType<number, boolean> = {
	types: {
		postgres: typeFunc,
		mysql: typeFunc,
		websql: typeFunc,
		odata: {
			name: 'Edm.Boolean',
		},
	},

	fetchProcessing: (data, callback) => {
		callback(null, data === 1);
	},

	validate: (originalValue, required, callback) => {
		// We use Number rather than parseInt as it deals with booleans and will return NaN for things like "a1"
		const value = Number(originalValue);
		if (_.isNaN(value) || (value !== 0 && value !== 1)) {
			callback(`is not a boolean: ${JSON.stringify(originalValue)} (${typeof originalValue})`);
		}
		else {
			callback(null, value);
		}
	},
};

