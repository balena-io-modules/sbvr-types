chai = require 'chai'
chai.use(require('chai-datetime'))
chai.use(require('chai-as-promised'))
types = require '../bin/types'
util = require 'util'
_ = require 'lodash'

{ expect } = chai

exports.describe = (typeName, fn) ->
	type = types[typeName]
	test = (methodName) ->
		(inputs..., expected) ->
			if expected instanceof Error
				it "should reject #{util.inspect(inputs)} with #{expected.message}", (done) ->
					type[methodName] inputs..., (err, result) ->
						expect(err).to.equal(expected.message)
						done()
			else
				isFunc = _.isFunction(expected)
				matches =
					if isFunc
						"pass custom tests"
					else
						"return #{expected}"
				it "should accept #{util.inspect(inputs)} and #{matches}" , (done) ->
					type[methodName] inputs..., (err, result) ->
						expect(err).to.not.exist
						if isFunc
							expected(result, done)
						else
							if _.isDate(result) and _.isDate(expected)
								expect(result).to.equalDate(expected)
							else
								expect(result).to.deep.equal(expected)
							done()

	describe typeName, ->
		fn(
			type: type
			fetch: test('fetchProcessing')
			validate: test('validate')
		)
