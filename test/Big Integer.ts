import * as helpers from './helpers';

helpers.describe('Big Integer', (test) => {
	const testBigIntString = String(Number.MAX_SAFE_INTEGER) + '00000001';

	describe('fetchProcessing', function () {
		test.fetch(BigInt(1), '1');
		test.fetch(1, '1');
		test.fetch('1', '1');
		test.fetch(testBigIntString, testBigIntString);
		test.fetch(BigInt(testBigIntString), testBigIntString);
		test.fetch({}, new Error('Fetched bigint is not valid: object'));
		test.fetch(null, null);
	});

	describe('validate', function () {
		test.validate(
			1.1,
			new RangeError(
				'The number 1.1 cannot be converted to a BigInt because it is not an integer',
			),
		);
		test.validate('1.1', new SyntaxError('Cannot convert 1.1 to a BigInt'));
		test.validate('', new Error('Cannot convert empty string to a BigInt'));
		test.validate(
			'testNotANumber',
			new Error('Cannot convert testNotANumber to a BigInt'),
		);
		test.validate(
			NaN,
			new SyntaxError(
				'The number NaN cannot be converted to a BigInt because it is not an integer',
			),
		);
		test.validate(1, true, BigInt(1));
		test.validate('1', true, BigInt(1));
		test.validate(BigInt(testBigIntString), true, BigInt(testBigIntString));
		test.validate(testBigIntString, true, BigInt(testBigIntString));
	});
});
