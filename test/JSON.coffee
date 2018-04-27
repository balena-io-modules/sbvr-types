helpers = require './helpers'

helpers.describe 'SBVRJSON', (test) ->
	obj =
		a: 'a'
		b: 2
	arr = [
		'a'
		2
	]
	num = 1
	string = 'hello world'
	describe 'fetchProcessing', ->
		test.fetch(JSON.stringify(obj), obj)
		test.fetch(JSON.stringify(arr), arr)
		test.fetch(JSON.stringify(num), num)
		test.fetch(JSON.stringify(string), string)

	describe 'validate', ->
		test.validate(obj, true, JSON.stringify(obj))
		test.validate(arr, true, JSON.stringify(arr))
		test.validate(num, true, JSON.stringify(num))
		test.validate(string, true, JSON.stringify(string))
