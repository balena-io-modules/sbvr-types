import * as helpers from './helpers';
import { expect } from 'chai';

helpers.describe('Hashed', function (test) {
	const password = 'my password';
	describe('validate', () => {
		test.validate(password, true, async (result) => {
			expect(await test.type.compare(password, result)).to.be.true;
		});
		const longest = 'x'.repeat(72);
		test.validate(longest, true, async (result) => {
			expect(await test.type.compare(longest, result)).to.be.true;
		});
		test.validate('x'.repeat(73), true, new Error('longer than 72 bytes (73)'));
		// 'é' is 2 bytes in UTF-8
		test.validate(
			'x'.repeat(71) + 'é',
			true,
			new Error('longer than 72 bytes (73)'),
		);
		it('should reject long values in the schema', () => {
			expect(test.type.schema.safeParse('x'.repeat(72)).success).to.equal(true);
			expect(test.type.schema.safeParse('x'.repeat(73)).success).to.equal(
				false,
			);
		});
	});
});
