export {}

const helpers = require ('./helpers')
const { expect } = require('chai')

helpers.describe('SHA', (test: any) => {
	const password = 'my password'
	describe('validate', () => {
		test.validate(password, true, (result: any, done: any) => {
			expect(test.type.compare(password, result)).to.eventually.be.true
			.and.notify(done)
		})
	})
})