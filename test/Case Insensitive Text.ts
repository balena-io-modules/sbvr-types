import { runTest } from './helpers';

runTest<string, string>('Case Insensitive Text', (test) => {
	const teststring = 'hello world';
	describe('validate', () => {
		test.validate(teststring, true, teststring);
	});
});
