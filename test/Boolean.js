import * as helpers from './helpers';

helpers.describe('Boolean', function (test) {
	describe('types', function () {
		for (const db of Object.keys(test.types)) {
			const typeTest = test.types[db];
			describe(db, function () {
				typeTest(' NOT NULL', '', 'BOOLEAN DEFAULT FALSE NOT NULL');
				typeTest(
					' NOT NULL',
					'',
					' DEFAULT TRUE',
					'BOOLEAN DEFAULT TRUE NOT NULL',
				);
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
		test.validate(0, true, false);
		test.validate(1, true, true);
		test.validate(false, true, false);
		test.validate(true, true, true);
		test.validate('true', true, new Error('is not a boolean: "true" (string)'));
	});
});
