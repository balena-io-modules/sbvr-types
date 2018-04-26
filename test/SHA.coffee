helpers = require './helpers'
{ expect } = require 'chai'

helpers.describe 'SHA', (test) ->
	password = 'my password'
	describe 'validate', ->
		test.validate password, true, (result, done) ->
			expect(test.type.compare(password, result)).to.eventually.be.true
			.and.notify(done)
