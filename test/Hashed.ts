import { runTest } from './helpers';
import { expect } from 'chai';
import 'chai-as-promised';

runTest<string, string>('Hashed', (test) => {
	const password = 'my password';
	describe('validate', () => {
		test.validate(password, true, (result, done) => {
			if (test.type.compare) {
				expect(test.type.compare(password, result!)).to.eventually.be.true
				.and.notify(done);
			} else {
				throw new Error('Compare property missing on returned Hashed value');
			}
		});
		test.validate(null, false, null);
	});
});
