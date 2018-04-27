helpers = require './helpers'

helpers.describe 'ShortText', (test) ->
	string = 'hello world'
	describe 'validate', ->
		test.validate(string, true, string)
