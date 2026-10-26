import * as helpers from './helpers';

helpers.describe('Date Time', function (test) {
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
		// `toString` doesn't include the milliseconds
		test.validate(now.toString(), true, new Date(now.toString()));
		test.validate(now.toISOString(), true, now);
		// A blank string must not be read as 0, ie the epoch
		test.validate('', true, new Error('is not a valid date: '));
		test.validate(' ', true, new Error('is not a valid date:  '));
		test.validate(true, true, new Error('is not a valid date: true'));
		test.validate([], true, new Error('is not a valid date: '));
		test.validate(
			new Date(NaN),
			true,
			new Error('is not a valid date: Invalid Date'),
		);
	});
});
