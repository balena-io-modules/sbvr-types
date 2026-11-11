import z from 'zod';
import * as TypeUtils from '../type-utils';
import type { CastNode } from '@balena/abstract-sql-compiler' with {
	'resolution-mode': 'import',
};

export const types = {
	postgres: 'JSONB',
	mysql: 'JSON',
	websql: 'JSON',
	odata: {
		name: 'Edm.String', // TODO: What should this really be?
	},
};

type JSON = string | number | boolean | null | JSON[] | { [key: string]: JSON };
type JSONable =
	| string
	| number
	| boolean
	| null
	| undefined
	| JSONable[]
	| { [key: string]: JSONable }
	| { toJSON(): JSONable };

export type Types = TypeUtils.TsTypes<
	{ [key: string]: JSON } | JSON[],
	{ [key: string]: JSONable } | JSONable[]
>;
type DbWriteType = string;

export const nativeProperties: TypeUtils.NativeProperties = {
	'is represented by': {
		Text: (referencedField): CastNode => ['Cast', referencedField, 'Text'],
	},
};

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (typeof data === 'string') {
		return JSON.parse(data);
	}
	return data;
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired((value) => {
		// Disallow primitives
		if (typeof value !== 'object') {
			throw new Error(`is not an object/array: ${typeof value}`);
		}

		try {
			return JSON.stringify(value);
		} catch {
			throw new Error('cannot be turned into JSON: ' + value);
		}
	});

// Whether a value is JSON, ie what `z.json()` accepts: plain objects and arrays of strings, finite numbers,
// booleans and null
const isJSON = (value: unknown): boolean => {
	switch (typeof value) {
		case 'string':
		case 'boolean':
			return true;
		case 'number':
			return Number.isFinite(value);
		case 'object': {
			if (value === null) {
				return true;
			}
			if (Array.isArray(value)) {
				// Not `every`, which skips the holes of sparse arrays
				for (const item of value) {
					if (!isJSON(item)) {
						return false;
					}
				}
				return true;
			}
			const proto = Object.getPrototypeOf(value);
			return (
				(proto === Object.prototype || proto === null) &&
				Object.values(value).every(isJSON)
			);
		}
		default:
			return false;
	}
};

// `z.json()` is recursive, which `z.compile` can't compile, so the same check is done in one custom schema
export const schema = z.compile(
	z.custom<Types['Read']>((value) => {
		if (typeof value !== 'object' || value === null) {
			return false;
		}
		try {
			return isJSON(value);
		} catch (err) {
			// A cycle, or nesting too deep for the call stack
			if (err instanceof RangeError) {
				return false;
			}
			throw err;
		}
	}),
);
