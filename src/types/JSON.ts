import * as TypeUtils from './../TypeUtils';

export const SBVRJSON: SBVRType<string, Object> = {
	types: {
		postgres: 'TEXT',
		mysql: 'TEXT',
		websql: 'TEXT',
		odata: {
			name: 'Edm.String', // TODO: What should this really be?
		},
	},

	fetchProcessing: (data, callback) => {
		if (data == null) {
			return data;
		}
		try {
			callback(null, JSON.parse(data));
		} catch (e) {
			callback(e);
		}
	},

	validate: TypeUtils.validate.whenNotNull((value, required, callback) => {
		try {
			callback(null, JSON.stringify(value));
		} catch (e) {
			console.error('Error validating JSON type: ', e);
			callback('cannot be turned into JSON: ' + value);
		}
	}),
};
