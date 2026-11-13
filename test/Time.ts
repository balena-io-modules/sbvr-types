import { expect } from 'chai';
import * as helpers from './helpers';

helpers.describe('Time', function (test) {
	describe('fetchProcessing', function () {
		test.fetch('10:00:00', '1970-01-01T10:00:00.000Z');
		test.fetch('22:00:00.123', '1970-01-01T22:00:00.123Z');
		// postgres returns microseconds
		test.fetch('22:00:00.123456', '1970-01-01T22:00:00.123Z');
		// The en-US locale format that was previously stored as is on websql
		test.fetch('10:00:00 PM', '1970-01-01T22:00:00.000Z');
		test.fetch(null, null);
	});

	describe('validate', function () {
		const date = new Date('2024-07-01T22:00:00.123Z');
		test.validate(date, true, '22:00:00.123');
		test.validate(date.getTime(), true, '22:00:00.123');
		test.validate(date.toISOString(), true, '22:00:00.123');
		test.validate('2024-07-02T00:00:00.123+02:00', true, '22:00:00.123');
		test.validate(null, false, null);
		test.validate(null, true, new Error('cannot be null'));
		test.validate(
			'not a date',
			true,
			new Error('is not a valid date: not a date'),
		);

		it('should fetch back the time that it validates', async () => {
			const stored = await test.type.validate(date, true);
			expect(test.type.fetchProcessing(stored)).to.equal(
				'1970-01-01T22:00:00.123Z',
			);
		});
	});
});
