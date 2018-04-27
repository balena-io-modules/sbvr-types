export {}

const helpers = require('./helpers')

import { expect } from 'chai'
import {} from 'chai-as-promised'

helpers.describe('Hashed', (test: any) => {
	const password = 'my password'
	describe('validate', () => {
		test.validate(password, true, (result: any, done: any) => {
			expect(test.type.compare(password, result)).to.eventually.be.true
			.and.notify(done)
		})
	})
})