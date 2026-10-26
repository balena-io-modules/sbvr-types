import type { BitwiseAndNode } from '@balena/abstract-sql-compiler' with {
	'resolution-mode': 'import',
};
import * as TypeUtils from '../type-utils';
import z from 'zod';

export const types = {
	postgres: 'INTEGER',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Self.Color',
		complexType: `\
<ComplexType Name="Color">
	<Property Name="r" Nullable="false" Type="Edm.Byte"/>\
	<Property Name="g" Nullable="false" Type="Edm.Byte"/>\
	<Property Name="b" Nullable="false" Type="Edm.Byte"/>\
	<Property Name="a" Nullable="false" Type="Edm.Byte"/>\
</ComplexType>`,
	},
};

type ColorObj = {
	r: number;
	g: number;
	b: number;
	a: number;
};
export type Types = TypeUtils.TsTypes<ColorObj, number | ColorObj>;
type DbWriteType = number;

export const nativeProperties: TypeUtils.NativeProperties = {
	has: {
		'Red Component': (from): BitwiseAndNode => [
			'BitwiseAnd',
			['BitwiseShiftRight', from, ['Number', 16]],
			['Number', 255],
		],
		'Green Component': (from): BitwiseAndNode => [
			'BitwiseAnd',
			['BitwiseShiftRight', from, ['Number', 8]],
			['Number', 255],
		],
		'Blue Component': (from): BitwiseAndNode => [
			'BitwiseAnd',
			from,
			['Number', 255],
		],
		'Alpha Component': (from): BitwiseAndNode => [
			'BitwiseAnd',
			['BitwiseShiftRight', from, ['Number', 24]],
			['Number', 255],
		],
	},
};

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null) {
		return data;
	}
	if (typeof data !== 'number') {
		throw new Error('Fetched color is not an integer: ' + typeof data);
	}
	/* eslint-disable no-bitwise */
	return {
		r: (data >> 16) & 0xff,
		g: (data >> 8) & 0xff,
		b: data & 0xff,
		a: (data >> 24) & 0xff,
	};
	/* eslint-enable no-bitwise */
};

const component = z.int().min(0).max(255).optional();
export const schema = z.compile(
	z.union([
		TypeUtils.schema.integer
			// The unsigned form (eg 0xffffffff) is accepted as well as the signed form that the INTEGER column stores
			.pipe(
				z
					.int()
					.min(-(2 ** 31))
					.max(2 ** 32 - 1),
			)
			// eslint-disable-next-line no-bitwise
			.transform((v) => v | 0),
		z
			.strictObject({
				r: component,
				red: component,
				g: component,
				green: component,
				b: component,
				blue: component,
				a: component,
				alpha: component,
			})
			.refine(
				(v) =>
					(v.r == null || v.red == null) &&
					(v.g == null || v.green == null) &&
					(v.b == null || v.blue == null) &&
					(v.a == null || v.alpha == null),
				'has the same component more than once',
			),
	]),
);

const toInteger = (color: z.output<typeof schema>) => {
	if (typeof color === 'number') {
		return color;
	}
	/* eslint-disable no-bitwise */
	return (
		((color.a ?? color.alpha ?? 0) << 24) |
		((color.r ?? color.red ?? 0) << 16) |
		((color.g ?? color.green ?? 0) << 8) |
		(color.b ?? color.blue ?? 0)
	);
	/* eslint-enable no-bitwise */
};

const components = new Set([
	'r',
	'red',
	'g',
	'green',
	'b',
	'blue',
	'a',
	'alpha',
]);
export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.fromSchema(
		z.compile(schema.transform(toInteger)),
		(value) => {
			if (typeof value !== 'object' || value == null || Array.isArray(value)) {
				return 'is neither an integer or color object: ' + String(value);
			}
			for (const [name, componentValue] of Object.entries(value)) {
				if (!components.has(name)) {
					return 'has an unknown component: ' + name;
				}
				if (
					typeof componentValue !== 'number' ||
					!Number.isInteger(componentValue) ||
					componentValue < 0 ||
					componentValue > 255
				) {
					return (
						'has invalid component value of ' +
						componentValue +
						' for component ' +
						name
					);
				}
			}
			return 'has the same component more than once';
		},
	);
