_ = require('lodash')
Promise = require('bluebird')
module.exports = {
	types:
		postgres: 'BYTEA'
		mysql: 'BLOB'
		websql: 'BLOB'
		odata:
			name: 'Edm.String' # TODO: What should this really be?
	validate: Promise.method (value, required) ->
		if Buffer.isBuffer(value)
			return value
		else if _.isString(value)
			if value.length % 2 != 0
				throw new Error('could not be converted to binary: hex string must have an even length')
			if !/^[a-fA-F0-9]*$/.test(value)
				throw new Error('could not be converted to binary: hex string must contain only hex characters')
			try
				return new Buffer(value, 'hex')
			catch e
				throw new Error("could not be converted to binary: #{e.message}")
		else
			throw new Error("could not be converted to binary: #{typeof value}")
}
