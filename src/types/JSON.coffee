Promise = require('bluebird')
module.exports = {
	types:
		postgres: 'TEXT'
		mysql: 'TEXT'
		websql: 'TEXT'
		odata:
			name: 'Edm.String' # TODO: What should this really be?

	fetchProcessing: Promise.method (data) ->
		return JSON.parse(data)

	validate: Promise.method (value, required) ->
		try
			return JSON.stringify(value)
		catch e
			console.error(e)
			throw new Error('cannot be turned into JSON: ' + value)
}
