import * as helpers from './helpers';

helpers.describe('Tstzrange', (test) => {
	const now = new Date('2024-01-15T10:00:00Z');
	const later = new Date('2024-01-15T12:00:00Z');

	describe('fetchProcessing', () => {
		// [lower,upper)
		test.fetch('[2024-01-15T10:00:00Z,2024-01-15T12:00:00Z)', {
			lower: '2024-01-15T10:00:00.000Z',
			upper: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: false,
		});

		// [lower,upper]
		test.fetch('[2024-01-15T10:00:00Z,2024-01-15T12:00:00Z]', {
			lower: '2024-01-15T10:00:00.000Z',
			upper: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: true,
		});

		// (lower,upper)
		test.fetch('(2024-01-15T10:00:00Z,2024-01-15T12:00:00Z)', {
			lower: '2024-01-15T10:00:00.000Z',
			upper: '2024-01-15T12:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: false,
		});

		// Range with infinity (no upper bound)
		test.fetch('[2024-01-15T10:00:00Z,)', {
			lower: '2024-01-15T10:00:00.000Z',
			upper: null,
			lowerInclusive: true,
			upperInclusive: false,
		});

		// Empty range
		test.fetch('empty', null);

		// Null value
		test.fetch(null, null);
	});

	describe('validate', () => {
		test.validate(
			'[2024-01-15T10:00:00Z,2024-01-15T12:00:00Z)',
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate('empty', true, 'empty');

		// String format - infinity upper bound
		test.validate(
			'[2024-01-15T10:00:00Z,)',
			true,
			'[2024-01-15T10:00:00.000Z,)',
		);

		test.validate(
			{ lower: now, upper: later },
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate(
			{
				lower: '2024-01-15T10:00:00Z',
				upper: '2024-01-15T12:00:00Z',
			},
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate(
			{ lower: now.getTime(), upper: later.getTime() },
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		// infinity upper bound
		test.validate(
			{ lower: now, upper: null },
			true,
			'[2024-01-15T10:00:00.000Z,)',
		);

		// no upper bound (undefined)
		test.validate({ lower: now }, true, '[2024-01-15T10:00:00.000Z,)');

		test.validate(
			{
				lower: now,
				upper: later,
				lowerInclusive: false,
				upperInclusive: true,
			},
			true,
			'(2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z]',
		);

		// Object format - all exclusive
		test.validate(
			{
				lower: now,
				upper: later,
				lowerInclusive: false,
				upperInclusive: false,
			},
			true,
			'(2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate(
			{
				lower: now,
				upper: later,
				lowerInclusive: true,
				upperInclusive: true,
			},
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z]',
		);

		// Error: Invalid string format
		test.validate(
			'not-a-range',
			true,
			new Error(
				'Invalid tstzrange format: not-a-range. Expected format like ' +
					"'[2024-01-01T00:00:00Z,2024-12-31T23:59:59Z)' or 'empty'",
			),
		);

		// Error: Missing lower bound in string
		test.validate(
			'[,2024-01-15T12:00:00Z)',
			true,
			new Error('tstzrange lower bound cannot be empty'),
		);

		// Error: Missing lower bound in object
		test.validate(
			{ upper: later },
			true,
			new Error('tstzrange must have a lower bound'),
		);

		// Error: Invalid lower bound date
		test.validate(
			{ lower: 'not-a-date', upper: later },
			true,
			new Error('Invalid lower bound: not-a-date'),
		);

		// Error: Invalid upper bound date
		test.validate(
			{ lower: now, upper: 'not-a-date' },
			true,
			new Error('Invalid upper bound: not-a-date'),
		);

		// Error: Invalid type
		test.validate(
			123,
			true,
			new Error('Invalid tstzrange: expected string or object, got number'),
		);
	});
});
