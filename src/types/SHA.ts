import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as TypeUtils from './../TypeUtils';

let sha256: (value: string) => string;

try {
	const crypto = require('crypto');
	sha256 = (value) => {
		const hash = crypto.createHash('sha256');
		hash.update(value);
		return `SHA256:HEX:${hash.digest('hex')}`;
	};
} catch (e) {
	const crypto = require('sha.js');
	sha256 = (value) => {
		const hash = crypto('sha256');
		hash.update(value);
		return `SHA256:HEX:${hash.digest('hex')}`;
	};
}


export const SHA: SBVRType<string, string> = {
	types: {
		postgres: 'CHAR(76)',
		mysql: 'CHAR(76)',
		websql: 'CHAR(76)',
		odata: {
			name: 'Edm.String',
		},
	},

	validate: TypeUtils.validate.whenNotNull((value, required, callback) => {
		if (!_.isString(value)) {
			callback('is not a string');
		}
		else {
			const hash = sha256(value);
			callback(null, hash);
		}
	}),

	compare: (value, result) => {
		const hash = sha256(value);
		return Promise.resolve(hash == result);
	},
};
