import * as helpers from './helpers';

helpers.describe('Time', function (test) {
	const now = new Date();
	now.setFullYear(1970);
	now.setMonth(0);
	now.setDate(1);
	describe('fetchProcessing', function () {
		test.fetch(
			now.toTimeString(),
			new Date('Thu, 01 Jan 1970 ' + now.toTimeString()).toISOString(),
		);
		test.fetch(null, null);
	});

	describe('validate', function () {
		test.validate(now, true, now.toLocaleTimeString());
		test.validate(now.getTime(), true, now.toLocaleTimeString());
		test.validate(now.toString(), true, now.toLocaleTimeString());
	});
});
