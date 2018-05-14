import { runTest } from './helpers';

runTest<string, string>('Text', (test) => {
	const teststring = 'hello world';
	describe('validate', () => {
		test.validate(teststring, true, teststring);
	});
});
