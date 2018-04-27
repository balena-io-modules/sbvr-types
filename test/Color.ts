export {}

const helpers = require ('./helpers')

helpers.describe('Color', (test: any) => {
	describe('fetchProcessing', () => {
		test.fetch(0, {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		})
		test.fetch(-1, {
			r: 255,
			g: 255,
			b: 255,
			a: 255
		})
	})

	describe('validate', () => {
		test.validate({
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}, true, 0)
		test.validate({
			r: 255,
			g: 255,
			b: 255,
			a: 255
		}, true, -1)
		test.validate(0, true, 0)
		test.validate(-1, true, -1)
	})
})