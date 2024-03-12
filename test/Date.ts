import * as helpers from './helpers';

helpers.describe('Date', function (test) {
	const now = new Date();
	describe('fetchProcessing', function () {
		test.fetch(now, now.toISOString());
		test.fetch(now.toString(), new Date(now.toString()).toISOString());
		test.fetch(now.getTime(), new Date(now.getTime()).toISOString());
		test.fetch(null, null);
	});

	describe('validate', function () {
		test.validate(now, true, now);
		test.validate(now.getTime(), true, now);
		test.validate(now.toString(), true, now);
	});
});
