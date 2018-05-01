/// <reference path="../src/SBVRType.d.ts" />
const chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('chai-datetime'))
const types = require('../dist/index')
import * as util from 'util'
import * as _ from 'lodash'
import { expect } from 'chai'

export function runTest<I,O>(typeName: string, fn: (test: SBVRTypeTest<I,O>) => any) {
	const type = types[typeName]
	const test = (methodName: string, isAsync: boolean = true) => {
		const method = (...args: any[]) => {
			const inputs = args.slice(0, args.length - 1)
			const callback = args[args.length - 1]
			let _method = _.get(type, methodName)
			if (isAsync) {
				return _method.apply(null, args)
			}
			else {
				try {
					const result = _method.apply(null, inputs)
					callback(null, result)
				} catch (err) {
					callback(err)
				}
			}
		}

		return (...args: any[]) => {
			const inputs = args.slice(0, args.length - 1)
			const expected = args[args.length - 1]
			if (_.isError(expected)) {
				it(`should reject ${util.inspect(inputs)} with ${expected.message}`, (done) => {
					method.apply(null, [...inputs, (err: Error, result: any) => {
						expect(err).to.equal(expected.message)
						expect(result).to.be.undefined
						return done()
					}])
					return
				})
			} else {
				const isFunc = _.isFunction(expected)
				let matches: string
				if (isFunc) {
					matches = 'pass custom tests'
				}
				else {
					matches = `return ${expected}`
				}

				it(`should accept ${util.inspect(inputs)} and ${matches}` , (done) => {+
					method.apply(null, [...inputs, (err: Error, result: any) => {
						expect(err).to.not.exist
						if (isFunc) {
							expected(result, done)
						} else {
							if (_.isDate(result) && _.isDate(expected)) {
								expect(result).to.equalDate(expected)
							} else {
								expect(result).to.deep.equal(expected)
							}
							return done()
						}
					}])
					return 
				})
			}
		}
	}

	describe(typeName, () => {
		fn({
			type: type,
			types: {
				postgres: test('types.postgres', false),
				mysql: test('types.mysql', false),
				websql: test('types.websql', false)
			},
			fetch: test('fetchProcessing'),
			validate: test('validate')
		})
	})
}