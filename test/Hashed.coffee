helpers = require './helpers'
{ expect } = require 'chai'

helpers.describe 'Hashed', ({ type }) ->
	password = 'my password'
	describe 'validate', ->
		it "should take '#{password}' and generate a hash that can be compared against", ->
			type.validate password, true, (err, result) ->
				expect(err).to.not.exist
				type.compare(password, result)
				.then (matching) ->
					expect(matching).to.be.true
