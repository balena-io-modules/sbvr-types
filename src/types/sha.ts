// We are using the P-H-C storing format:
// https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
import * as _crypto from 'crypto';
import * as _shajs from 'sha.js';

import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as TypeUtils from '../type-utils';

let sha256: (value: string) => string;
try {
	// tslint:disable-next-line:no-var-requires
	const crypto: typeof _crypto = require('crypto');
	sha256 = value => {
		const hash = crypto.createHash('sha256');
		hash.update(value);
		return `$sha256$${hash.digest('base64')}`;
	};
} catch {
	// tslint:disable-next-line:no-var-requires
	const shajs: typeof _shajs = require('sha.js');
	sha256 = value => {
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

export const validate = TypeUtils.validate.checkRequired(value => {
	if (!_.isString(value)) {
		throw new Error('is not a string');
	} else {
		return sha256(value);
	}
});

export const compare = Promise.method((value: string, result: string) => {
	return sha256(value) === result;
});
