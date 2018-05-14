import { runTest } from './helpers';

runTest<number, number>('Integer', (test) => {
	describe('validate', () => {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
	});
});