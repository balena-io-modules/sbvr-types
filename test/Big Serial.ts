import * as helpers from './helpers';

helpers.describe('Big Serial', function (test) {
	describe('types', function () {
		describe('mysql', function () {
			test.types.mysql(' NOT NULL', '', 'BIGINT NOT NULL AUTO_INCREMENT');
			test.types.mysql(
				' NOT NULL',
				'',
				' DEFAULT 1',
				'BIGINT DEFAULT 1 NOT NULL AUTO_INCREMENT',
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

	const testBigIntString = String(Number.MAX_SAFE_INTEGER) + '00000001';

	describe('fetchProcessing', function () {
		test.fetch(1, BigInt(1));
		test.fetch('1', BigInt(1));
		test.fetch('1', BigInt(1));
		test.fetch(BigInt(testBigIntString), BigInt(testBigIntString));
		test.fetch(testBigIntString, BigInt(testBigIntString));
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
