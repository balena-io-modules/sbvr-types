Promise = require('bluebird')
TypeUtils = require('../TypeUtils')
module.exports = {
	types:
		postgres: 'TIMESTAMP'
		mysql: 'TIMESTAMP'
		websql: 'INTEGER'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: Promise.method (data) ->
		if data?
			return new Date(data)
		return data

	validate: TypeUtils.validate.date
}
