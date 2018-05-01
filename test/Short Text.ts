import { runTest } from './helpers'

runTest<string, string>('ShortText', (test) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})