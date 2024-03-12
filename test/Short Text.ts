import * as helpers from './helpers';

helpers.describe('Short Text', function (test) {
	const str = 'hello world';
	describe('validate', () => {
		test.validate(str, true, str);
	});
});
