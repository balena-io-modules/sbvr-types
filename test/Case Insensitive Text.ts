import { runTest } from "./helpers";

runTest<string, string>('Case Insensitive Text', (test) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})
