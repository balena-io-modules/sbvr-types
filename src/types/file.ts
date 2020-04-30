import * as TypeUtils from '../type-utils';
export const types = {
	postgres: 'BYTEA',
	mysql: 'BLOB',
	websql: 'BLOB',
	odata: {
		name: 'Edm.String', // TODO: What should this really be?
	},
};

export const validate = TypeUtils.validate.checkRequired(value => {
	if (Buffer.isBuffer(value)) {
		return value;
	} else if (typeof value === 'string') {
		if (value.length % 2 !== 0) {
			throw new Error(
				'could not be converted to binary: hex string must have an even length',
			);
		}
		if (!/^[a-fA-F0-9]*$/.test(value)) {
			throw new Error(
				'could not be converted to binary: hex string must contain only hex characters',
			);
		}
		try {
			return new Buffer(value, 'hex');
		} catch (e) {
			throw new Error(`could not be converted to binary: ${e.message}`);
		}
	} else {
		throw new Error(`could not be converted to binary: ${typeof value}`);
	}
});
