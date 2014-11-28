helpers = require './helpers'

helpers.describe 'ForeignKey', (test) ->
	describe 'validate', ->
		test.validate(1, true, 1)
		test.validate('1', true, 1)
