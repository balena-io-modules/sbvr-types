helpers = require './helpers'

helpers.describe 'Case Insensitive Text', (test) ->
	string = 'hello world'
	describe 'validate', ->
		test.validate(string, true, string)
