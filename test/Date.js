import * as helpers from './helpers';

helpers.describe('Date', function (test) {
	const now = new Date();
	describe('fetchProcessing', function () {
		test.fetch(now, now);
		test.fetch(now.toString(), now);
		test.fetch(now.getTime(), now);
		test.fetch(null, null);
	});

	describe('validate', function () {
		test.validate(now, true, now);
		test.validate(now.getTime(), true, now);
		test.validate(now.toString(), true, now);
	});
});
