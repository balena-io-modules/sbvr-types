import * as _bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as TypeUtils from './../TypeUtils';

let bcrypt: typeof _bcrypt;

try {
	bcrypt = require('bcrypt');
} catch (e) {
	bcrypt = require('bcryptjs');
}

export const Hashed: SBVRType<string, string> = {
	types: {
		postgres: 'CHAR(60)',
		mysql: 'CHAR(60)',
		websql: 'CHAR(60)',
		odata: {
			name: 'Edm.String',
		},
	},

	validate: TypeUtils.validate.whenNotNull((value, required, callback) => {
		if (!_.isString(value)) {
			callback('is not a string');
		} else {
			Promise.resolve(bcrypt.genSalt())
			.then((salt) => bcrypt.hash(value, salt))
			.asCallback(callback);
		}
	}),

	compare: Promise.method(_.bind(bcrypt.compare, bcrypt)),
};
