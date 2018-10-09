Promise = require('bluebird')
TypeUtils = require('../TypeUtils')
module.exports = {
	types:
		postgres: 'TIME'
		mysql: 'TIME'
		websql: 'TEXT'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: Promise.method (data) ->
		if data?
			# We append the date of the epoch so that we can parse this as a valid date.
			return new Date('Thu, 01 Jan 1970 ' + data)
		return data

	validate: Promise.method (value, required) ->
		return TypeUtils.validate.date(value, required)
			.then (value) ->
				return value.toLocaleTimeString()
}
