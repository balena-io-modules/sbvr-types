import { runTest } from './helpers';

runTest<number, number>('Serial', (test) => {
	describe('types', () => {
		describe('mysql', () => {
			test.types.mysql(' NOT NULL', '', 'INTEGER NOT NULL AUTO_INCREMENT');
			test.types.mysql(' NOT NULL', '', ' DEFAULT 1', 'INTEGER DEFAULT 1 NOT NULL AUTO_INCREMENT');
		});

		describe('websql', () => {
			test.types.websql(' NOT NULL', '', 'INTEGER NOT NULL AUTOINCREMENT');
			test.types.websql(' NOT NULL', '', ' DEFAULT 1', 'INTEGER DEFAULT 1 NOT NULL AUTOINCREMENT');
		});
	});

	describe('validate', () => {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
		test.validate(null, false, null);
	});
});
