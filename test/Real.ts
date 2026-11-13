import * as helpers from './helpers';

helpers.describe('Real', (test) => {
	describe('validate', function () {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
		test.validate(1.5, true, 1.5);
		test.validate('1.5', true, 1.5);
		test.validate('1e3', true, 1000);
		test.validate('-.5', true, -0.5);
		test.validate(1e21, true, 1e21);
		for (const value of [
			'12abc',
			'0x10',
			'',
			' ',
			// Surrounding whitespace isn't part of a number
			' 1',
			'1 ',
			'Infinity',
			Infinity,
			NaN,
			true,
			[1],
		]) {
			test.validate(value, true, new Error(`is not a number: ${value}`));
		}
	});
});
