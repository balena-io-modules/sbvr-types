chai = require 'chai'
chai.use(require('chai-datetime'))
types = require '../bin/types'
util = require 'util'

{ expect } = chai

exports.describe = (typeName, fn) ->
	type = types[typeName]
	test = (methodName) ->
		(inputs..., expected) ->
			it "should accept #{util.inspect(inputs)} and return #{expected}", ->
				type[methodName] inputs..., (err, result) ->
					expect(err).to.not.exist
					if result instanceof Date and expected instanceof Date
						expect(result).to.equalDate(expected)
					else
						expect(result).to.deep.equal(expected)

	describe typeName, ->
		fn(
			type: type
			fetch: test('fetchProcessing')
			validate: test('validate')
		)
