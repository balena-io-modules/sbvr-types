// We are using the P-H-C storing format:
// https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
import * as TypeUtils from '../type-utils';

let sha256: (value: string) => string;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const crypto = require('crypto') as typeof import('crypto');
	sha256 = (value) => {
		const hash = crypto.createHash('sha256');
		hash.update(value);
		return `$sha256$${hash.digest('base64')}`;
	};
} catch {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const shajs = require('sha.js') as typeof import('sha.js');
	sha256 = (value) => {
		const hash = shajs('sha256');
		hash.update(value);
		return `$sha256$${hash.digest('base64')}`;
	};
}

export const types = {
	postgres: 'CHAR(54)',
	mysql: 'CHAR(54)',
	websql: 'CHAR(54)',
	odata: {
		name: 'Edm.String',
	},
};

export const validateSync = sha256;

export const validate = TypeUtils.validate.checkRequired((value) => {
	if (typeof value !== 'string') {
		throw new Error('is not a string');
	}
	return sha256(value);
});

export const compare = async (value: string, result: string) => {
	return sha256(value) === result;
};
