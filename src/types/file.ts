import z from 'zod';
import * as TypeUtils from '../type-utils';
export const types = {
	postgres: 'BYTEA',
	mysql: 'BLOB',
	websql: 'BLOB',
	odata: {
		name: 'Edm.String', // TODO: What should this really be?
	},
};

export type Types = TypeUtils.TsTypes<Buffer, Buffer | string>;
type DbWriteType = Buffer;

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired((value) => {
		if (Buffer.isBuffer(value)) {
			return value;
		}
		if (typeof value !== 'string') {
			throw new Error(`could not be converted to binary: ${typeof value}`);
		}
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
			return Buffer.from(value, 'hex');
		} catch (e: any) {
			throw new Error(`could not be converted to binary: ${e.message}`);
		}
	});

export const schema = z.union([
	z.instanceof(Buffer),
	z
		.string()
		.refine(
			(v) => v.length % 2 === 0,
			'could not be converted to binary: hex string must have an even length',
		)
		.refine(
			(v) => /^[a-fA-F0-9]*$/.test(v),
			'could not be converted to binary: hex string must contain only hex characters',
		)
		.transform((v) => Buffer.from(v, 'hex')),
]);
