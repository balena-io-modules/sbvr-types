import { runTest } from './helpers'

runTest<number, RGBA> ('Color', (test) => {
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
		test.validate({
			r: 0,
			g: 277,
			b: 0,
			a: 0
		}, true, Error('has invalid component value of 277 for component g'))
		test.validate('red', true, Error('is neither an integer or color object: red'))
	})
})