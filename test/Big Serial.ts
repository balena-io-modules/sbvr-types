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
		test.fetch(BigInt(1), '1');
		test.fetch(1, '1');
		test.fetch('1', '1');
		test.fetch(testBigIntString, testBigIntString);
		test.fetch(BigInt(testBigIntString), testBigIntString);
		test.fetch({}, new Error('Fetched bigint is not valid: object'));
		test.fetch(null, null);
	});

	describe('validate', function () {
		const maxBigInt = 2n ** 63n - 1n;
		const minBigInt = -(2n ** 63n);
		test.validate(1, true, BigInt(1));
		test.validate('1', true, BigInt(1));
		test.validate('0'.repeat(20) + '1', true, BigInt(1));
		test.validate(' -1 ', true, BigInt(-1));
		test.validate(Number.MAX_SAFE_INTEGER, true, 2n ** 53n - 1n);
		test.validate(maxBigInt, true, maxBigInt);
		test.validate(String(maxBigInt), true, maxBigInt);
		test.validate(String(minBigInt), true, minBigInt);
		for (const value of [
			1.1,
			'1.1',
			'',
			' ',
			'testNotANumber',
			'12abc',
			// More digits than a BIGINT can have
			'1'.repeat(20),
			'0x10',
			'1e3',
			NaN,
			true,
			[1],
			// Numbers outside the safe integer range have already lost precision
			2 ** 53,
			// Outside the range of a BIGINT
			maxBigInt + 1n,
			String(minBigInt - 1n),
			testBigIntString,
		]) {
			test.validate(value, true, new Error(`is not a big integer: ${value}`));
		}
	});
});
