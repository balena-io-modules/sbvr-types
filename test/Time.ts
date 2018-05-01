import { runTest } from './helpers'

runTest<InternalDate, NullableDate>('Time', (test) => {
	const now = new Date()
	now.setFullYear(1970, 0, 1)
	describe('fetchProcessing', () => {
		test.fetch(now.toTimeString(), now)
		test.fetch(null, null)
	})

	describe('validate', () => {
		test.validate(now, true, now.toLocaleTimeString())
		test.validate(now.getTime(), true, now.toLocaleTimeString())
		test.validate(now.toString(), true, now.toLocaleTimeString())
	})
})