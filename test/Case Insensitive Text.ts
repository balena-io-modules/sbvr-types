import { runTest } from "./helpers";

runTest<string, string>('CaseInsensitiveText', (test) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})
