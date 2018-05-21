import { runTest } from './helpers';

runTest<number, number>('ConceptType', (test) => {
	describe('validate', () => {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
		test.validate(null, false, null);
	});
});
