helpers = require './helpers'

helpers.describe 'Date Time Range', (test) ->
	start = new Date()
	end = 'null'
	bounds = '[)'
	describe 'fetchProcessing', ->
		test.fetch(bounds[0] + start + ', ' + end + bounds[1], {
			Start: start.toString()
			End: end
			Bounds: bounds
		})

	describe 'validate', ->
		start = new Date()
		end = null
		bounds = '[)'
		test.validate({
			Start: start
			End: end
			Bounds: bounds
		}, true,  bounds[0] + start + ', ' + end + bounds[1])