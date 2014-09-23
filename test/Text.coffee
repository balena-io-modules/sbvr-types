helpers = require './helpers'

helpers.describe 'Text', (test) ->
	string = 'hello world'
	describe 'validate', ->
		test.validate(string, true, string)
