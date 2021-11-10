import * as helpers from './helpers';

helpers.describe('InformativeReference', (test) => {
	describe('validate', function () {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
	});
});
