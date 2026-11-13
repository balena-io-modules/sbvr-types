import * as helpers from './helpers';

helpers.describe('Interval', (test) => {
	describe('validate', function () {
		// Not limited to an INTEGER on Postgres, where it's an INTERVAL
		test.validate(2 ** 31, true, 2 ** 31);
		test.validate(1, true, 1);
		test.validate('1', true, 1);
	});
});
