import { runTest } from './helpers';

runTest<number, boolean> ('Boolean', (test) => {
	describe('types', () => {
		for (const db in test.types) {
			const typeTest = test.types[db];
			describe(db, () => {
				typeTest(' NOT NULL', '', 'INTEGER DEFAULT 0 NOT NULL');
				typeTest(' NOT NULL', '', ' DEFAULT 1', 'INTEGER DEFAULT 1 NOT NULL');
			});
		}
	});

	describe('fetchProcessing', () => {
		test.fetch(0, false);
		test.fetch(1, true);
	});

	describe('validate', () => {
		test.validate(0, true, 0);
		test.validate(1, true, 1);
		test.validate('true', true, new Error('is not a boolean: "true" (string)'));
	});
});