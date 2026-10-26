import { expect } from 'chai';
import * as helpers from './helpers';

helpers.describe('Short Text', function (test) {
	const str = 'hello world';
	describe('validate', () => {
		test.validate(str, true, str);
		test.validate('a'.repeat(255), true, 'a'.repeat(255));
		test.validate(
			'a'.repeat(256),
			true,
			new Error('longer than 255 characters (256)'),
		);
		// Each emoji is 2 UTF-16 code units, but a single character for the database
		test.validate('😀'.repeat(255), true, '😀'.repeat(255));
		test.validate(
			'😀'.repeat(256),
			true,
			new Error('longer than 255 characters (256)'),
		);
		it('should count characters in the schema', () => {
			expect(test.type.schema.safeParse('😀'.repeat(255)).success).to.equal(
				true,
			);
			expect(test.type.schema.safeParse('😀'.repeat(256)).success).to.equal(
				false,
			);
			expect(test.type.schema.safeParse('a'.repeat(256)).success).to.equal(
				false,
			);
		});
	});
});
