import { expect } from 'chai';
import * as helpers from './helpers';

helpers.describe('Boolean', function (test) {
	describe('types', function () {
		for (const db of Object.keys(test.types) as Array<
			keyof typeof test.types
		>) {
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

	it('should type the default value argument of the type functions', () => {
		expect(test.type.types.postgres(' NOT NULL', '', ' DEFAULT TRUE')).to.equal(
			'BOOLEAN DEFAULT TRUE NOT NULL',
		);
	});

	describe('fetchProcessing', function () {
		test.fetch(0, false);
		test.fetch(1, true);
		test.fetch(false, false);
		test.fetch(true, true);
		test.fetch(null, null);
	});

	describe('validate', function () {
		test.validate(0, true, false);
		test.validate(1, true, true);
		test.validate(false, true, false);
		test.validate(true, true, true);
		test.validate('true', true, new Error('is not a boolean: "true" (string)'));
		test.validate('0', true, false);
		test.validate('1', true, true);
		test.validate('', true, new Error('is not a boolean: "" (string)'));
		test.validate(' ', true, new Error('is not a boolean: " " (string)'));
		test.validate('0x1', true, new Error('is not a boolean: "0x1" (string)'));
		test.validate('1.0', true, new Error('is not a boolean: "1.0" (string)'));
		test.validate(2, true, new Error('is not a boolean: 2 (number)'));
		test.validate([], true, new Error('is not a boolean: [] (object)'));
		test.validate([1], true, new Error('is not a boolean: [1] (object)'));
		test.validate(1n, true, new Error('is not a boolean: 1 (bigint)'));
	});
});
