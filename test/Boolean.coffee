helpers = require './helpers'

helpers.describe 'Boolean', (test) ->
	describe 'fetchProcessing', ->
		test.fetch(0, false)
		test.fetch(1, true)

	describe 'validate', ->
		test.validate(0, true, 0)
		test.validate(1, true, 1)
		test.validate("true", true, new Error('is not a boolean: "true" (string)'))
