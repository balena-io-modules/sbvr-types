export {}

const helpers = require ('./helpers')

helpers.describe('Interval', (test: any) => {
	describe('validate', () => {
		test.validate(1, true, 1)
		test.validate('1', true, 1)
	})
})