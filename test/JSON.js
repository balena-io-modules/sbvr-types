import * as helpers from './helpers';

helpers.describe('JSON', function (test) {
	const obj = {
		a: 'a',
		b: 2,
	};
	const arr = ['a', 2];
	const num = 1;
	const str = 'hello world';
	describe('fetchProcessing', function () {
		test.fetch(JSON.stringify(obj), obj);
		test.fetch(JSON.stringify(arr), arr);
		test.fetch(JSON.stringify(num), num);
		test.fetch(JSON.stringify(str), str);
	});

	describe('validate', function () {
		test.validate(obj, true, JSON.stringify(obj));
		test.validate(arr, true, JSON.stringify(arr));
		test.validate(num, true, JSON.stringify(num));
		test.validate(str, true, JSON.stringify(str));
	});
});
