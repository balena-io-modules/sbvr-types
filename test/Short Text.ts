export {}

const helpers = require ('./helpers')
helpers.describe('ShortText', (test: any) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})