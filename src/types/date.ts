import type { LessThanNode } from '@balena/abstract-sql-compiler' with {
	'resolution-mode': 'import',
};
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'DATE',
	mysql: 'DATE',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

export type Types = TypeUtils.TsTypes<string, string | number | Date>;
type DbWriteType = Date;

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return data;
	}
	let date: Date;
	if (data instanceof Date) {
		date = data;
	} else if (typeof data === 'string' || typeof data === 'number') {
		date = new Date(data);
	} else {
		throw new Error('Fetched date is not valid: ' + typeof data);
	}
	return date.toISOString();
};

export const nativeFactTypes: TypeUtils.NativeFactTypes = {
	Date: {
		...TypeUtils.nativeFactTypeTemplates.equality,
		'is before': (from, to): LessThanNode => ['LessThan', from, to],
	},
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.date;
