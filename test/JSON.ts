import { runTest } from './helpers';

runTest<string, Object>('JSON', (test) => {
	const obj = {
		a: 'a',
		b: 2,
	};
	const arr = [ 'a', 2 ];
	const num = 1;
	const teststring = 'hello world';
	describe('fetchProcessing', () => {
		test.fetch(JSON.stringify(obj), obj);
		test.fetch(JSON.stringify(arr), arr);
		test.fetch(JSON.stringify(num), num);
		test.fetch(JSON.stringify(teststring), teststring);
	});

	describe('validate', () => {
		test.validate(obj, true, JSON.stringify(obj));
		test.validate(arr, true, JSON.stringify(arr));
		test.validate(num, true, JSON.stringify(num));
		test.validate(teststring, true, JSON.stringify(teststring));
	});
});