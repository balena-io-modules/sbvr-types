import { runTest } from './helpers'

runTest<Buffer, Buffer>('File', (test) => {
	describe('validate', () => {
		const hex = '5261777221'
		const buf = new Buffer(hex, 'hex')
		test.validate(buf, true, buf)
		test.validate(hex, true, buf)
		test.validate('Error', true, new Error('could not be converted to binary: hex string must have an even length'))
		test.validate('Even Error', true, new Error('could not be converted to binary: hex string must contain only hex characters'))
		test.validate(1, true, new Error('could not be converted to binary: number'))
	})
})