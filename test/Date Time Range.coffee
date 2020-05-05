helpers = require './helpers'

helpers.describe 'Date Time Range', (test) ->
	describe 'fetchProcessing', ->
		test.fetch('["2010-01-01 14:30:00","2010-01-01 15:30:00")', {
			lowerInclusive: true,
			lowerDate: new Date('2010-01-01 14:30:00'),
			upperDate: new Date('2010-01-01 15:30:00'),
			upperInclusive: false,
		})
		test.fetch('("2010-01-01 14:30:00",]', {
			lowerInclusive: false,
			lowerDate: new Date('2010-01-01 14:30:00'),
			upperDate: undefined,
			upperInclusive: true,
		})
		test.fetch('[,"2010-01-01 14:30:00"]', {
			lowerInclusive: true,
			lowerDate: undefined,
			upperDate: new Date('2010-01-01 14:30:00'),
			upperInclusive: true,
		})
		test.validate('[2010-01-01T14:30:00.000Z,2010-01-01T15:30:00.000Z)', {
			lowerInclusive: true,
			lowerDate: new Date('2010-01-01 14:30:00'),
			upperDate: new Date('2010-01-01 15:30:00'),
			upperInclusive: false,
		})

	describe 'validate', ->
		test.validate({
			lowerInclusive: true,
			lowerDate: new Date('2010-01-01 14:30:00'),
			upperDate: new Date('2010-01-01 15:30:00'),
			upperInclusive: false,
		}, true, '["2010-01-01T14:30:00.000Z","2010-01-01T15:30:00.000Z")')
		test.validate({
			lowerInclusive: false,
			lowerDate: new Date('2010-01-01 14:30:00'),
			upperDate: undefined,
			upperInclusive: true,
		}, true, '("2010-01-01T14:30:00.000Z",]')
		test.validate({
			lowerInclusive: true,
			lowerDate: undefined,
			upperDate: new Date('2010-01-01 14:30:00'),
			upperInclusive: true,
		}, true, '[,"2010-01-01T14:30:00.000Z"]')
		# test.validate({
		# 	r: 0
		# 	g: 0
		# 	b: 0
		# 	a: 0
		# }, true, 0)
		# test.validate({
		# 	r: 255
		# 	g: 255
		# 	b: 255
		# 	a: 255
		# }, true, -1)
		# test.validate(0, true, 0)
		# test.validate(-1, true, -1)
