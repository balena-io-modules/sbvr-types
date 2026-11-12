import { expect } from 'chai';
import type { Types } from '../';
import * as helpers from './helpers';

helpers.describe('JSON', function (test) {
	const obj = {
		a: 'a',
		b: 2,
	};
	const arr = ['a', 2];
	const num = 1;
	const str = 'hello world';
	const dateObj = new Date();
	const booleanObj = Boolean(true);
	const stringObj = String('true');
	const numberObj = Number(1);

	describe('fetchProcessing', function () {
		test.fetch(JSON.stringify(obj), obj);
		test.fetch(JSON.stringify(arr), arr);
		test.fetch(JSON.stringify(num), num);
		test.fetch(JSON.stringify(str), str);
	});

	describe('validate', function () {
		test.validate(obj, true, JSON.stringify(obj));
		test.validate(arr, true, JSON.stringify(arr));
		test.validate(
			dateObj,
			true,
			new Error(
				`is not an object/array once turned into JSON: ${JSON.stringify(dateObj)}`,
			),
		);
		test.validate(
			{ toJSON: () => undefined },
			true,
			new Error('is not an object/array once turned into JSON: undefined'),
		);
		test.validate(
			{ a: 1n },
			true,
			new Error(
				'cannot be turned into JSON: Do not know how to serialize a BigInt',
			),
		);
		test.validate(
			num,
			false,
			new Error(`is not an object/array: ${typeof num}`),
		);
		test.validate(
			str,
			false,
			new Error(`is not an object/array: ${typeof str}`),
		);
		test.validate(
			booleanObj,
			false,
			new Error(`is not an object/array: ${typeof booleanObj}`),
		);
		test.validate(
			stringObj,
			false,
			new Error(`is not an object/array: ${typeof stringObj}`),
		);
		test.validate(
			numberObj,
			false,
			new Error(`is not an object/array: ${typeof numberObj}`),
		);
	});

	it('should only allow JSON values in the Write type, like the schema', () => {
		// @ts-expect-error - `undefined` is not a JSON value
		const undefinedProp: Types['JSON']['Write'] = { a: undefined };
		// @ts-expect-error - a Date is not a JSON value, even though it has a `toJSON`
		const dateProp: Types['JSON']['Write'] = { a: dateObj };
		expect(test.type.schema.safeParse(undefinedProp).success).to.equal(false);
		expect(test.type.schema.safeParse(dateProp).success).to.equal(false);
	});
});
