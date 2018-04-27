export {}

const helpers = require ('./helpers')

helpers.describe('Text', (test: any) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})
