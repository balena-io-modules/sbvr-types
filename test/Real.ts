import * as helpers from './helpers';

helpers.describe('Real', (test) => {
	describe('validate', function () {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
		test.validate(1.5, true, 1.5);
		test.validate('1.5', true, 1.5);
	});
});
