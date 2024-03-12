import type * as Bcrypt from 'bcrypt';

import * as TypeUtils from '../type-utils';

let bcrypt: typeof Bcrypt;
try {
	bcrypt = require('bcrypt');
} catch {
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

type WriteType = string;
type DbWriteType = string;

export const validate: TypeUtils.Validate<WriteType, DbWriteType> =
	TypeUtils.validate.checkRequired(async (value) => {
		if (typeof value !== 'string') {
			throw new Error('is not a string');
		}
		const salt = await bcrypt.genSalt();
		return bcrypt.hash(value, salt);
	});

export const compare = bcrypt.compare.bind(bcrypt);
