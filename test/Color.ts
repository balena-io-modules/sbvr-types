import { expect } from 'chai';
import * as helpers from './helpers';

helpers.describe('Color', function (test) {
	describe('fetchProcessing', function () {
		test.fetch(0, {
			r: 0,
			g: 0,
			b: 0,
			a: 0,
		});
		test.fetch(-1, {
			r: 255,
			g: 255,
			b: 255,
			a: 255,
		});
		test.fetch(null, null);
	});

	describe('validate', function () {
		test.validate(
			{
				r: 0,
				g: 0,
				b: 0,
				a: 0,
			},
			true,
			0,
		);
		test.validate(
			{
				r: 255,
				g: 255,
				b: 255,
				a: 255,
			},
			true,
			-1,
		);
		test.validate(0, true, 0);
		test.validate(-1, true, -1);
		test.validate('255', true, 255);
		// The unsigned form of -1
		test.validate(0xffffffff, true, -1);
		test.validate({ red: 1, green: 2, blue: 3, alpha: 4 }, true, 0x04010203);
		test.validate({ g: 1 }, true, 0x100);
		test.validate({}, true, 0);
		for (const value of [2 ** 32, -(2 ** 31) - 1, 1.5, '12abc', true, []]) {
			test.validate(
				value,
				true,
				new Error(`is neither an integer or color object: ${value}`),
			);
		}
		for (const component of [-1, 256, 1.5, '255', null]) {
			test.validate(
				{ r: component },
				true,
				new Error(
					`has invalid component value of ${component} for component r`,
				),
			);
		}
		test.validate({ R: 1 }, true, new Error('has an unknown component: R'));
		test.validate(
			{ r: 1, red: 2 },
			true,
			new Error('has the same component more than once'),
		);
	});

	describe('nativeProperties', function () {
		const color = { r: 0x12, g: 0x34, b: 0x56, a: 0x78 };
		// Evaluates the abstract sql that the native property generates, with the field holding `stored`
		const evaluate = (node: any, stored: number): number => {
			/* eslint-disable no-bitwise */
			switch (node[0]) {
				case 'ReferencedField':
					return stored;
				case 'Number':
					return node[1];
				case 'BitwiseAnd':
					return evaluate(node[1], stored) & evaluate(node[2], stored);
				case 'BitwiseShiftRight':
					return evaluate(node[1], stored) >> evaluate(node[2], stored);
				default:
					throw new Error(`Unexpected node: ${node[0]}`);
			}
			/* eslint-enable no-bitwise */
		};
		for (const [property, component] of [
			['Red Component', 'r'],
			['Green Component', 'g'],
			['Blue Component', 'b'],
			['Alpha Component', 'a'],
		] as const) {
			it(`should extract the ${component} component for '${property}'`, async () => {
				const stored = await test.type.validate(color, true);
				const node = test.type.nativeProperties.has![property]!([
					'ReferencedField',
					'table',
					'field',
				]);
				expect(evaluate(node, stored)).to.equal(color[component]);
			});
		}
	});
});
