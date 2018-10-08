do ->
	try
		bcrypt = require('bcrypt')
	catch
		bcrypt = require('bcryptjs')

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
				Promise.resolve(bcrypt.genSalt())
				.then((salt) -> bcrypt.hash(value, salt))
				.asCallback(callback)

		compare: Promise.method(_.bind(bcrypt.compare, bcrypt))
	}
