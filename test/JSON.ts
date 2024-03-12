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
		test.validate(dateObj, true, JSON.stringify(dateObj));
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
});
