Promise = require('bluebird')
TypeUtils = require('../TypeUtils')
module.exports = {
	types:
		postgres: 'TEXT'
		mysql: 'TEXT'
		websql: 'TEXT'
		odata:
			name: 'Edm.String' # TODO: What should this really be?

	fetchProcessing: Promise.method (data) ->
		return JSON.parse(data)

	validate: TypeUtils.validate.checkRequired (value) ->
		try
			return JSON.stringify(value)
		catch
			throw new Error('cannot be turned into JSON: ' + value)
}
