helpers = require './helpers'

helpers.describe 'Date Time Range', (test) ->
	begin = new Date()
	end = null + ''
	bounds = '[)'
	describe 'fetchProcessing', ->
		test.fetch(bounds[0] + begin + ', ' + end + bounds[1], {
			Begin: begin.toString()
			End: end
			Bounds: bounds
		})

	describe 'validate', ->
		begin = new Date()
		end = null
		bounds = '[)'
		test.validate({
			Begin: begin
			End: end
			Bounds: bounds
		}, true,  bounds[0] + begin + ', ' + end + bounds[1])