import * as helpers from './helpers';

helpers.describe('Boolean', function (test) {
	describe('types', function () {
		for (const db of Object.keys(test.types)) {
			const typeTest = test.types[db];
			describe(db, function () {
				typeTest(' NOT NULL', '', 'INTEGER DEFAULT 0 NOT NULL');
				typeTest(' NOT NULL', '', ' DEFAULT 1', 'INTEGER DEFAULT 1 NOT NULL');
			});
		}
	});

	describe('fetchProcessing', function () {
		test.fetch(0, false);
		test.fetch(1, true);
		test.fetch(false, false);
		test.fetch(true, true);
	});

	describe('validate', function () {
		test.validate(0, true, 0);
		test.validate(1, true, 1);
		test.validate(false, true, 0);
		test.validate(true, true, 1);
		test.validate('true', true, new Error('is not a boolean: "true" (string)'));
	});
});
