do ->
	try
		bcrypt = require('bcrypt')
	catch
		bcrypt = require('bcryptjs')
	bcrypt = Promise.promisifyAll(bcrypt)
	return {
		types:
			postgres: 'CHAR(60)'
			mysql: 'CHAR(60)'
			websql: 'CHAR(60)'
			odata:
				name: 'Edm.String'

		validate: (value, required, callback) ->
			if !_.isString(value)
				callback('is not a string')
			else
				bcrypt.genSaltAsync()
				.then (salt) ->
					bcrypt.hashAsync(value, salt)
				.nodeify(callback)

		compare: _.bind(bcrypt.compareAsync, bcrypt)
	}
