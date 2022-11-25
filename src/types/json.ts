import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'JSONB',
	mysql: 'JSON',
	websql: 'JSON',
	odata: {
		name: 'Edm.String', // TODO: What should this really be?
	},
};

export const fetchProcessing = (data: any) => {
	if (typeof data === 'string') {
		return JSON.parse(data);
	}
	return data;
};

export const validate = TypeUtils.validate.checkRequired((value) => {
	// Disallow primitives
	if (typeof value !== 'object') {
		throw new Error(`is not an object/array: ${typeof value}`);
	}

	try {
		return JSON.stringify(value);
	} catch {
		throw new Error('cannot be turned into JSON: ' + value);
	}
});
