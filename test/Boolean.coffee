helpers = require './helpers'

helpers.describe 'Boolean', (test) ->
	describe 'types', ->
		for db, typeTest of test.types
			describe db, ->
				typeTest ' NOT NULL', '', 'INTEGER DEFAULT 0 NOT NULL'
				typeTest ' NOT NULL', '', ' DEFAULT 1', 'INTEGER DEFAULT 1 NOT NULL'

	describe 'fetchProcessing', ->
		test.fetch(0, false)
		test.fetch(1, true)
		test.fetch(false, false)
		test.fetch(true, true)

	describe 'validate', ->
		test.validate(0, true, 0)
		test.validate(1, true, 1)
		test.validate(false, true, 0)
		test.validate(true, true, 1)
		test.validate('true', true, new Error('is not a boolean: "true" (string)'))
