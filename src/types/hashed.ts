import * as crypto from 'crypto';
import * as TypeUtils from '../type-utils';

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

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired(async (value) => {
		if (typeof value !== 'string') {
			throw new Error('is not a string');
		}
		const salt = crypto.randomBytes(16).toString('hex');
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(value, salt, 1000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					reject(err);
				}
				resolve(derivedKey.toString('hex'));
			});
		});
	});

export const compare = (data: string | Buffer, encrypted: string) => {
	return new Promise<boolean>((resolve, reject) => {
		const [storedHash, storedSalt] = encrypted.split('$');
		if (!storedSalt) {
			reject(new Error('Invalid hash'));
			return;
		}
		crypto.pbkdf2(data, storedSalt, 1000, 64, 'sha512', (err, derivedKey) => {
			if (err) {
				return reject(err);
			}
			resolve(storedHash === derivedKey.toString('hex'));
		});
	});
};
