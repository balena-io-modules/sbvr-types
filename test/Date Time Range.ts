import { expect } from 'chai';
import type { Types } from '../';
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
			lowerInclusive: true,
			upperInclusive: false,
		});

		// Range with infinity (no lowerDate bound) - exclusive
		test.fetch('(,"2024-01-15T12:00:00Z")', {
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: false,
		});

		// Range with infinity (no lowerDate bound) - inclusive upper
		test.fetch('(,"2024-01-15T12:00:00Z"]', {
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: true,
		});

		// The PostgreSQL format, with a space separated timestamp
		test.fetch('["2024-01-15 10:00:00+00","2024-01-15 12:00:00+00")', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: false,
		});

		// Unquoted, as `validate` writes it and mysql/websql store it as is
		test.fetch('[2024-01-15T10:00:00.000Z,2024-01-15T12:00:00.000Z)', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: false,
		});
		test.fetch('(2024-01-15T10:00:00.000Z,)', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			lowerInclusive: false,
			upperInclusive: false,
		});
		test.fetch('[,2024-01-15T12:00:00.000Z]', {
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: true,
		});
		test.fetch('(,)', {
			lowerInclusive: false,
			upperInclusive: false,
		});

		// PostgreSQL outputs infinite bounds unquoted, they are treated as unbounded
		test.fetch('["2024-01-15 10:00:00+00",infinity)', {
			lowerDate: '2024-01-15T10:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: false,
		});
		test.fetch('[-infinity,"2024-01-15 12:00:00+00"]', {
			upperDate: '2024-01-15T12:00:00.000Z',
			lowerInclusive: true,
			upperInclusive: true,
		});
		// The read type can't represent these
		for (const range of [
			'[infinity,infinity]',
			'[-infinity,-infinity]',
			'(infinity,)',
			'(,-infinity)',
		]) {
			test.fetch(
				range,
				new Error(
					`Unsupported infinite bound in tstzrange: ${range}. Only a -infinity lower bound and an infinity upper bound are supported`,
				),
			);
		}
		test.fetch(
			'[2024-01-15T10:00:00.000Z,not-a-date)',
			new Error('Invalid upper bound timestamp: not-a-date'),
		);
		// Unbalanced quotes and bounds with brackets or parentheses are rejected
		for (const range of [
			'["2024-01-15T10:00:00Z,2024-01-15T12:00:00Z)',
			'[2024-01-15T10:00:00Z",2024-01-15T12:00:00Z)',
			'[2024-01-15T10:00:00Z,"2024-01-15T12:00:00Z)',
			'[2024-01-15T10:00:00Z,2024-01-15T12:00:00Z")',
			'[2024-01-15 10:00:00+00 (junk),)',
			'[2024-01-15 10:00:00+00 [junk],)',
			'(,2024-01-15 12:00:00+00 (junk))',
			'["2024-01-15 10:00:00+00 (junk)",)',
		]) {
			test.fetch(
				range,
				new Error(
					`Invalid tstzrange format: ${range}. Expected format like '[2024-01-01T00:00:00Z,2024-12-31T23:59:59Z)' or 'empty'`,
				),
			);
		}
		test.fetch(
			'2024-01-15T10:00:00.000Z',
			new Error(
				"Invalid tstzrange format: 2024-01-15T10:00:00.000Z. Expected format like '[2024-01-01T00:00:00Z,2024-12-31T23:59:59Z)' or 'empty'",
			),
		);

		// Empty range
		test.fetch('empty', 'empty');

		// Null value
		test.fetch(null, null);
	});

	describe('validate', () => {
		it('should type null bounds as unbounded', async () => {
			const unbounded: Types['Date Time Range']['Write'] = {
				lowerDate: null,
				upperDate: null,
				lowerInclusive: false,
				upperInclusive: false,
			};
			expect(await test.type.validate(unbounded, true)).to.equal('(,)');
		});

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

		it('should fetch back what it validates', async () => {
			const value = {
				lowerDate: '2024-01-15T10:00:00.000Z',
				upperDate: '2024-01-15T12:00:00.000Z',
				lowerInclusive: false,
				upperInclusive: true,
			};
			const stored = await test.type.validate(value, true);
			expect(test.type.fetchProcessing(stored)).to.deep.equal(value);
		});

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
