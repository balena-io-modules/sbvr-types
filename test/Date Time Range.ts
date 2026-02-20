import * as helpers from './helpers';

helpers.describe('Date Time Range', (test) => {
	const now = new Date('2024-01-15T10:00:00Z');
	const later = new Date('2024-01-15T12:00:00Z');

	describe('fetchProcessing', () => {
		// [lowerDate,upperDate)
		test.fetch('["2024-01-15T10:00:00Z","2024-01-15T12:00:00Z")', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: false,
		});

		// [lowerDate,upperDate) - with timezone offset (normalized to UTC)
		test.fetch('["2024-01-15T12:00:00+02:00","2024-01-15T14:00:00+02:00")', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: false,
		});

		// [lowerDate,upperDate]
		test.fetch('["2024-01-15T10:00:00Z","2024-01-15T12:00:00Z"]', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: true,
		});

		// (lowerDate,upperDate)
		test.fetch('("2024-01-15T10:00:00Z","2024-01-15T12:00:00Z")', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: false,
		});

		// Range with infinity (no upperDate bound)
		test.fetch('["2024-01-15T10:00:00Z",)', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: null,
			lowerInclusive: true,
			upperInclusive: false,
		});

		// Range with infinity (no lowerDate bound) - exclusive
		test.fetch('(,"2024-01-15T12:00:00Z")', {
			lowerDate: null,
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: false,
		});

		// Range with infinity (no lowerDate bound) - inclusive upper
		test.fetch('(,"2024-01-15T12:00:00Z"]', {
			lowerDate: null,
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: true,
		});

		// Empty range
		test.fetch('empty', 'empty');

		// Null value
		test.fetch(null, null);
	});

	describe('validate', () => {
		test.validate('empty', true, 'empty');

		test.validate(
			{
				lowerDate: now,
				upperDate: later,
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate(
			{
				lowerDate: '2024-01-15T10:00:00Z',
				upperDate: '2024-01-15T12:00:00Z',
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate(
			{
				lowerDate: now.getTime(),
				upperDate: later.getTime(),
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		// infinity upperDate bound
		test.validate(
			{
				lowerDate: now,
				upperDate: null,
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			'[2024-01-15T10:00:00.000Z,)',
		);

		// Error: missing required props
		test.validate(
			{ lowerDate: now } as any,
			true,
			new Error('lowerInclusive is required and must be a boolean'),
		);

		test.validate(
			{
				lowerDate: now,
				upperDate: later,
				lowerInclusive: false,
				upperInclusive: true,
			},
			true,
			'(2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z]',
		);

		// Object format - all exclusive
		test.validate(
			{
				lowerDate: now,
				upperDate: later,
				lowerInclusive: false,
				upperInclusive: false,
			},
			true,
			'(2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)',
		);

		test.validate(
			{
				lowerDate: now,
				upperDate: later,
				lowerInclusive: true,
				upperInclusive: true,
			},
			true,
			'[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z]',
		);

		// Error: Invalid string format (only 'empty' literal allowed)
		test.validate(
			'not-a-range',
			true,
			new Error("Invalid tstzrange: expected 'empty' or object, got string"),
		);

		// Error: String range format not allowed (only 'empty' literal)
		test.validate(
			'(,2024-01-15T12:00:00Z)',
			true,
			new Error("Invalid tstzrange: expected 'empty' or object, got string"),
		);

		// Object format - null lowerDate
		test.validate(
			{
				lowerDate: null,
				upperDate: later,
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			'[,2024-01-15T12:00:00.000Z)',
		);

		// Error: missing required props (only upperDate provided)
		test.validate(
			{ upperDate: later } as any,
			true,
			new Error('lowerInclusive is required and must be a boolean'),
		);

		// Error: Invalid lowerDate bound date
		test.validate(
			{
				lowerDate: 'not-a-date',
				upperDate: later,
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			new Error('Invalid lowerDate bound: not-a-date'),
		);

		// Error: Invalid upperDate bound date
		test.validate(
			{
				lowerDate: now,
				upperDate: 'not-a-date',
				lowerInclusive: true,
				upperInclusive: false,
			},
			true,
			new Error('Invalid upperDate bound: not-a-date'),
		);

		// Error: Invalid type
		test.validate(
			123,
			true,
			new Error("Invalid tstzrange: expected 'empty' or object, got number"),
		);
	});
});
