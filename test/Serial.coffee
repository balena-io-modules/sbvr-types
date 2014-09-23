helpers = require './helpers'

helpers.describe 'Serial', (test) ->
	describe 'validate', ->
		test.validate(1, true, 1)
		test.validate('1', true, 1)
