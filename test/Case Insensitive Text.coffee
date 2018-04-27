helpers = require './helpers'

helpers.describe 'CIText', (test) ->
	string = 'hello world'
	describe 'validate', ->
		test.validate(string, true, string)
