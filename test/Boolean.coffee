helpers = require './helpers'

helpers.describe 'Boolean', (test) ->
	describe 'types', ->
		for db, typeTest of test.types
			describe db, ->
				typeTest ' NOT NULL', '', 'BOOLEAN DEFAULT FALSE NOT NULL'
				typeTest ' NOT NULL', '', ' DEFAULT TRUE', 'BOOLEAN DEFAULT TRUE NOT NULL'

	describe 'fetchProcessing', ->
		test.fetch(0, false)
		test.fetch(1, true)
		test.fetch(false, false)
		test.fetch(true, true)

	describe 'validate', ->
		test.validate(0, true, false)
		test.validate(1, true, true)
		test.validate(false, true, false)
		test.validate(true, true, true)
		test.validate('true', true, new Error('is not a boolean: "true" (string)'))
