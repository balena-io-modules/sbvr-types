import * as helpers from './helpers';

helpers.describe('Integer', (test) => {
	describe('validate', function () {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
		test.validate('0'.repeat(20) + '1', true, 1);
		test.validate('+1', true, 1);
		test.validate('-1', true, -1);
		test.validate(2 ** 31, true, 2 ** 31);
		for (const value of [
			1.5,
			'1.5',
			'1e3',
			1e21,
			'12abc',
			// More digits than a safe integer can have
			'1'.repeat(17),
			'0x10',
			'',
			' ',
			// Surrounding whitespace isn't part of an integer
			' 1',
			'1 ',
			'\n1',
			true,
			[1],
			{},
			NaN,
			Infinity,
			// Outside the safe integer range, so it has lost precision
			2 ** 53,
			'9007199254740993',
		]) {
			test.validate(value, true, new Error(`is not an integer: ${value}`));
		}
	});
});
