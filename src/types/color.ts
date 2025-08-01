import type {
	BitwiseAndNode,
	BitwiseShiftRightNode,
} from '@balena/abstract-sql-compiler' with { 'resolution-mode': 'import' };
import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTEGER',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Self.Color',
		complexType: `\
<ComplexType Name="Color">
	<Property Name="r" Nullable="false" Type="Edm.Int8"/>\
	<Property Name="g" Nullable="false" Type="Edm.Int8"/>\
	<Property Name="b" Nullable="false" Type="Edm.Int8"/>\
	<Property Name="a" Nullable="false" Type="Edm.Int8"/>\
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
		'Blue Component': (from): BitwiseShiftRightNode => [
			'BitwiseShiftRight',
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

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired((value) => {
		let processedValue: number;
		if (typeof value !== 'object') {
			processedValue = parseInt(value, 10);
			if (Number.isNaN(processedValue)) {
				throw new Error('is neither an integer or color object: ' + value);
			}
		} else {
			processedValue = 0;
			Object.keys(value).forEach((component) => {
				const componentValue = value[component];
				if (Number.isNaN(componentValue) || componentValue > 255) {
					throw new Error(
						'has invalid component value of ' +
							componentValue +
							' for component ' +
							component,
					);
				}
				/* eslint-disable no-bitwise */
				switch (component.toLowerCase()) {
					case 'r':
					case 'red':
						processedValue |= componentValue << 16;
						break;
					case 'g':
					case 'green':
						processedValue |= componentValue << 8;
						break;
					case 'b':
					case 'blue':
						processedValue |= componentValue;
						break;
					case 'a':
					case 'alpha':
						processedValue |= componentValue << 24;
						break;
					default:
						throw new Error('has an unknown component: ' + component);
				}
				/* eslint-enable no-bitwise */
			});
		}
		return processedValue;
	});
