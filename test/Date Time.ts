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
		test.validate(now.toISOString(), true, now);
		test.validate('2024-02-29', true, new Date('2024-02-29T00:00:00Z'));
		test.validate(
			'2024-01-15T10:00Z',
			true,
			new Date('2024-01-15T10:00:00.000Z'),
		);
		test.validate(
			'2024-01-15T10:00:00.123+05:30',
			true,
			new Date('2024-01-15T04:30:00.123Z'),
		);
		test.validate(-1, true, new Date(-1));
		// Digits after milliseconds are fine as long as nothing would be truncated
		test.validate(
			'2024-01-15T10:00:00.123000Z',
			true,
			new Date('2024-01-15T10:00:00.123Z'),
		);
		test.validate(
			'2024-01-15T10:00:00.100000000+00:00',
			true,
			new Date('2024-01-15T10:00:00.100Z'),
		);
		// Only ISO 8601 strings, without fields that `Date` would roll over, and whole milliseconds
		for (const value of [
			now.toString(),
			'foo 2020',
			'2023-02-29',
			'2020-02-30',
			'2024-13-01',
			'2024-01-15T24:00:00Z',
			'2024-01-15T10:00:00.1234Z',
			'2024-01-15T10:00:00.123456Z',
			'2024-01-15T10:00:00.1230000000Z',
			'2024-01-15 10:00:00Z',
			'2024',
			'-000000-01-01',
			'1700000000000',
			'1e3',
			1.7,
			8.64e15 + 1,
		]) {
			test.validate(value, true, new Error(`is not a valid date: ${value}`));
		}
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
