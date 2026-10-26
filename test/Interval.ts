import * as helpers from './helpers';

helpers.describe('Interval', (test) => {
	describe('fetchProcessing', function () {
		// mysql/websql store an INTEGER
		test.fetch(5, 5);
		test.fetch(null, null);
		// postgres returns INTERVAL values as parsed by `postgres-interval`
		test.fetch({ seconds: 5 }, 5);
		// The `EXTRACT(EPOCH FROM INTERVAL '5 days 3 hours')` example from the postgres docs
		test.fetch({ days: 5, hours: 3 }, 442800);
		// '1 year 2 mons 3 days 04:05:06.789'
		test.fetch(
			{
				years: 1,
				months: 2,
				days: 3,
				hours: 4,
				minutes: 5,
				seconds: 6,
				milliseconds: 789,
			},
			(365.25 + 2 * 30 + 3) * 86400 + 4 * 3600 + 5 * 60 + 6.789,
		);
		// '-00:00:01.5'
		test.fetch({ seconds: -1, milliseconds: -500 }, -1.5);
		test.fetch('00:00:05', new Error('Fetched interval is not valid: string'));
	});

	describe('validate', function () {
		test.validate(1, true, 1);
		test.validate('1', true, 1);
	});
});
