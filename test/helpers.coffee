chai = require 'chai'
chai.use(require('chai-datetime'))
chai.use(require('chai-as-promised'))
types = require '../bin/types'
util = require 'util'
_ = require 'lodash'

{ expect } = chai

exports.describe = (typeName, fn) ->
	type = types[typeName]
	test = (methodName, isAsync = true) ->
		method = do ->
			_method = _.get(type, methodName)
			if isAsync
				return _method
			else
				return (args..., callback) ->
					try
						result = _method(args...)
					catch err
					callback(err, result)

		(inputs..., expected) ->
			if _.isError(expected)
				it "should reject #{util.inspect(inputs)} with #{expected.message}", (done) ->
					method inputs..., (err, result) ->
						expect(err).to.equal(expected.message)
						expect(result).to.be.undefined
						done()
			else
				isFunc = _.isFunction(expected)
				matches =
					if isFunc
						'pass custom tests'
					else
						"return #{expected}"
				it "should accept #{util.inspect(inputs)} and #{matches}" , (done) ->
					method inputs..., (err, result) ->
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
			types:
				postgres: test('types.postgres', false)
				mysql: test('types.mysql', false)
				websql: test('types.websql', false)
			fetch: test('fetchProcessing')
			validate: test('validate')
		)
