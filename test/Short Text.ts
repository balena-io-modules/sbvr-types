import { runTest } from './helpers'

runTest<string, string>('Short Text', (test) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})