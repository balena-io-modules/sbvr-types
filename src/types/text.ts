import type {
	CharacterLengthNode,
	StartsWithNode,
	EndsWithNode,
	ContainsNode,
} from '@balena/abstract-sql-compiler';
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TEXT',
	mysql: 'TEXT',
	websql: 'TEXT',
	odata: {
		name: 'Edm.String',
	},
};

export type Types = TypeUtils.TsTypes<string, string>;
type DbWriteType = string;

export const nativeProperties: TypeUtils.NativeProperties = {
	has: {
		Length: (from): CharacterLengthNode => ['CharacterLength', from],
	},
};

export const nativeFactTypes: TypeUtils.NativeFactTypes = {
	Text: {
		...TypeUtils.nativeFactTypeTemplates.equality,
		'starts with': (from, to): StartsWithNode => ['StartsWith', from, to],
		'ends with': (from, to): EndsWithNode => ['EndsWith', from, to],
		contains: (from, to): ContainsNode => ['Contains', from, to],
	},
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.text();
