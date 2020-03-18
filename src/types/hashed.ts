import * as _bcrypt from 'bcrypt';

import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as TypeUtils from '../type-utils';

let bcrypt: typeof _bcrypt;
try {
	// tslint:disable-next-line:no-var-requires
	bcrypt = require('bcrypt');
} catch {
	// tslint:disable-next-line:no-var-requires
	bcrypt = require('bcryptjs');
}

export const types = {
	postgres: 'CHAR(60)',
	mysql: 'CHAR(60)',
	websql: 'CHAR(60)',
	odata: {
		name: 'Edm.String',
	},
};

export const validate = TypeUtils.validate.checkRequired(value => {
	if (!_.isString(value)) {
		throw new Error('is not a string');
	} else {
		return Promise.resolve(bcrypt.genSalt()).then(salt =>
			bcrypt.hash(value, salt),
		);
	}
});

export const compare = Promise.method(_.bind(bcrypt.compare, bcrypt));
