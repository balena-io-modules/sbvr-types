import * as helpers from './helpers';

helpers.describe('Serial', function (test) {
	describe('types', function () {
		describe('mysql', function () {
			test.types.mysql(' NOT NULL', '', 'INTEGER NOT NULL AUTO_INCREMENT');
			test.types.mysql(
				' NOT NULL',
				'',
				' DEFAULT 1',
				'INTEGER DEFAULT 1 NOT NULL AUTO_INCREMENT',
			);
		});

		describe('websql', function () {
			test.types.websql(' NOT NULL', '', 'INTEGER NOT NULL AUTOINCREMENT');
			test.types.websql(
				' NOT NULL',
				'',
				' DEFAULT 1',
				'INTEGER DEFAULT 1 NOT NULL AUTOINCREMENT',
			);
		});
	});

	describe('validate', function () {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
	});
});
