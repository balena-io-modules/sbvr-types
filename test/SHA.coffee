helpers = require './helpers'
{ expect } = require 'chai'

helpers.describe 'SHA', (test) ->
	password = 'my password'
	describe 'validate', ->
		test.validate password, true, (result) ->
			expect(test.type.compare(password, result)).to.eventually.be.true
