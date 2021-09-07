import * as helpers from './helpers';
import { expect } from 'chai';

helpers.describe('SHA', function (test) {
	const password = 'my password';
	describe('validate', () => {
		test.validate(password, true, async (result) => {
			expect(await test.type.compare(password, result)).to.be.true;
		});
	});
});
