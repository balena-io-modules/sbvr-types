import z from 'zod';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'REAL',
	mysql: 'REAL',
	websql: 'REAL',
	odata: {
		name: 'Edm.Double',
	},
};

export type Types = TypeUtils.TsTypes<number, number>;
type DbWriteType = number;

export const nativeFactTypes: TypeUtils.NativeFactTypes = {
	Integer: TypeUtils.nativeFactTypeTemplates.comparison,
	Real: TypeUtils.nativeFactTypeTemplates.comparison,
};

// Strings are only accepted if they are entirely a decimal number, optionally with an exponent
const realString = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;
// `z.number()` rejects NaN and Infinity
export const schema = z.compile(
	z.union([
		z.number(),
		z.string().regex(realString).transform(Number).pipe(z.number()),
	]),
);

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.fromSchema(
		schema,
		(value) => 'is not a number: ' + String(value),
	);
