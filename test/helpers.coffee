chai = require 'chai'
chai.use(require('chai-datetime'))
chai.use(require('chai-as-promised'))
types = require '../'
util = require 'util'
_ = require 'lodash'
Promise = require 'bluebird'

{ expect } = chai

exports.describe = (typeName, fn) ->
	type = types[typeName]
	test = (methodName, isAsync = true) ->
		method = _.get(type, methodName)
		if !_.isFunction(method)
			method = _.constant(method)
		if !isAsync
			method = Promise.method(method)

		(inputs..., expected) ->
			if _.isError(expected)
				it "should reject #{util.inspect(inputs)} with #{expected.message}", ->
					expect(method(inputs...)).to.eventually.be.rejectedWith(expected.message)
			else
				isFunc = _.isFunction(expected)
				matches =
					if isFunc
						'pass custom tests'
					else
						"return #{expected}"
				it "should accept #{util.inspect(inputs)} and #{matches}" , ->
					promise = method(inputs...)
					if isFunc
						promise.then(expected)
					else if _.isDate(expected)
						expect(promise).to.eventually.equalDate(expected)
					else
						expect(promise).to.eventually.deep.equal(expected)

	describe typeName, ->
		fn(
			type: type
			types:
				postgres: test('types.postgres', false)
				mysql: test('types.mysql', false)
				websql: test('types.websql', false)
			fetch: test('fetchProcessing', false)
			validate: test('validate')
		)
