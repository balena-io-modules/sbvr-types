_ = require('lodash')
Promise = require('bluebird')
equality = (from, to) -> ['Equals', from, to]
checkRequired = (validateFn) ->
	return Promise.method (value, required) ->
		if value == null
			if required
				throw new Error('cannot be null')
			else
				return null
		return validateFn(value, true)
module.exports = {
	nativeFactTypeTemplates:
		equality:
			'is equal to': equality
			'equals': equality
		comparison:
			'is greater than': (from, to) -> ['GreaterThan', from, to]
			'is greater than or equal to': (from, to) -> ['GreaterThanOrEqual', from, to]
			'is less than': (from, to) -> ['LessThan', from, to]
			'is less than or equal to': (from, to) -> ['LessThanOrEqual', from, to]
			'is equal to': equality
			'equals': equality

	validate:
		checkRequired: checkRequired
		integer: checkRequired (value) ->
			processedValue = parseInt(value, 10)
			if _.isNaN(processedValue)
				throw new Error('is not a number: ' + value)
			else
				return processedValue
		text: (length) ->
			return checkRequired (value) ->
				if !_.isString(value)
					throw new Error('is not a string: ' + value)
				else if length? and value.length > length
					throw new Error('longer than ' + length + ' characters (' + value.length + ')')
				else
					return value
		date: checkRequired (value) ->
			processedValue = Number(value)
			if _.isNaN(processedValue)
				processedValue = value
			processedValue = new Date(processedValue)
			if _.isNaN(processedValue.getTime())
				throw new Error('is not a valid date: ' + value)
			else
				return processedValue
}
