_ = require('lodash')
Promise = require('bluebird')
try
	bcrypt = require('bcrypt')
catch
	bcrypt = require('bcryptjs')

module.exports = {
	types:
		postgres: 'CHAR(60)'
		mysql: 'CHAR(60)'
		websql: 'CHAR(60)'
		odata:
			name: 'Edm.String'

	validate: Promise.method (value, required) ->
		if !_.isString(value)
			throw new Error('is not a string')
		else
			return Promise.resolve(bcrypt.genSalt())
				.then((salt) -> bcrypt.hash(value, salt))

	compare: Promise.method(_.bind(bcrypt.compare, bcrypt))
}
