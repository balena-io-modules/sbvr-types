import { runTest } from './helpers'
import { expect } from 'chai'
import * as aws from 'aws-sdk-mock'

type AWSMock = {
	[ idx : string]: Buffer
}
const storage: AWSMock = {}

aws.mock('S3', 'upload', (params: any, cb: Function) => {
	storage[params.Key] = params.Body
	cb(null, { Location: params.Key })
})

runTest<string, string>('AWS File', (test) => {
	describe('validate', () => {
		const hex = '5261777221'
		const buf = new Buffer(hex, 'hex')
		
		test.validate(buf, true, (result, done) => {
			expect(result).to.be.a('string')
			expect(storage[result].toString()).to.equal('Rawr!')
			done()
		})
		test.validate(hex, true, (result, done) => {
			expect(result).to.be.a('string')
			expect(storage[result].toString()).to.equal('Rawr!')
			done()
		})
		test.validate('Error', true, new Error('could not be converted to binary: hex string must have an even length'))
		test.validate('Even Error', true, new Error('could not be converted to binary: hex string must contain only hex characters'))
		test.validate(1, true, new Error('could not be converted to binary: number'))
	})
})