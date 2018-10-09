# We are using the P-H-C storing format:
# https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
_ = require('lodash')
Promise = require('bluebird')
try
	crypto = require('crypto')
	sha256 = (value) ->
		hash = crypto.createHash('sha256')
		hash.update(value)
		return "$sha256$#{hash.digest('base64')}"
catch
	shajs = require('sha.js')
	sha256 = (value) ->
		hash = shajs('sha256')
		hash.update(value)
		return "$sha256$#{hash.digest('base64')}"
module.exports =  {
	types:
		postgres: 'CHAR(54)'
		mysql: 'CHAR(54)'
		websql: 'CHAR(54)'
		odata:
			name: 'Edm.String'

	validateSync: sha256

	validate: Promise.method (value, required) ->
		if !_.isString(value)
			throw new Error('is not a string')
		else
			return sha256(value)

	compare: (value, result) ->
		hash = sha256(value)
		return Promise.resolve(hash == result)
}
