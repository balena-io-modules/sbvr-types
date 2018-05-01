import { runTest } from "./helpers";

runTest<string, string>('CIText', (test) => {
	const string = 'hello world'
	describe('validate', () => {
		test.validate(string, true, string)
	})
})
