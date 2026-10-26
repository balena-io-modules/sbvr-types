import * as helpers from './helpers';
import { expect } from 'chai';

helpers.describe('SHA', function (test) {
	const password = 'my password';
	describe('validate', () => {
		test.validate(password, true, async (result) => {
			expect(await test.type.compare(password, result)).to.be.true;
		});
		test.validate(password, true, async (result) => {
			// As postgres returns it from the CHAR(54) column
			const padded = result.padEnd(54);
			expect(await test.type.compare(password, padded)).to.be.true;
			expect(await test.type.compare('other', padded)).to.be.false;
		});
	});
});
