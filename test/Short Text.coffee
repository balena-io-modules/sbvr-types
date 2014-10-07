helpers = require './helpers'

helpers.describe 'Short Text', (test) ->
	string = 'hello world'
	describe 'validate', ->
		test.validate(string, true, string)
