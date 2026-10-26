/// <reference types="node" preserve="true" />
import type * as Bcrypt from 'bcrypt';

import * as TypeUtils from '../type-utils';

let bcrypt: typeof Bcrypt;
try {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	bcrypt = require('bcrypt');
} catch {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
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

export type Types = TypeUtils.TsTypes<string, string>;
type DbWriteType = string;

// bcrypt ignores anything after the first 72 bytes, so longer values would match any value that starts with the same 72 bytes
const maxBytes = 72;

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired(async (value) => {
		if (typeof value !== 'string') {
			throw new Error('is not a string');
		}
		const bytes = Buffer.byteLength(value);
		if (bytes > maxBytes) {
			throw new Error(`longer than ${maxBytes} bytes (${bytes})`);
		}
		const salt = await bcrypt.genSalt();
		return bcrypt.hash(value, salt);
	});

export const compare: (
	data: string | Buffer,
	encrypted: string,
) => Promise<boolean> = bcrypt.compare.bind(bcrypt);

export const schema = TypeUtils.schema.text.refine(
	(v) => Buffer.byteLength(v) <= maxBytes,
	`longer than ${maxBytes} bytes`,
);
