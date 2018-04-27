export {}

const helpers = require ('./helpers')

helpers.describe('CIText', (test: any) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})
