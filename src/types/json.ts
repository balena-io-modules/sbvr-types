import * as TypeUtils from '../type-utils';

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
