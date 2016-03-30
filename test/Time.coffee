helpers = require './helpers'

helpers.describe 'Time', (test) ->
	now = new Date()
	now.setYear(1970)
	now.setMonth(0)
	now.setDate(1)
	describe 'fetchProcessing', ->
		test.fetch(now.toTimeString(), now)
		test.fetch(null, null)

	describe 'validate', ->
		test.validate(now, true, now.toLocaleTimeString())
		test.validate(now.getTime(), true, now.toLocaleTimeString())
		test.validate(now.toString(), true, now.toLocaleTimeString())

