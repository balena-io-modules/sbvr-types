Promise = require('bluebird')
TypeUtils = require('../type-utils')
module.exports = {
	types:
		postgres: 'DATE'
		mysql: 'DATE'
		websql: 'INTEGER'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: Promise.method (data) ->
		if data?
			return new Date(data)
		return data

	validate: TypeUtils.validate.date
}
