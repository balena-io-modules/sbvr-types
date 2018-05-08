# We are using the P-H-C storing format:
# https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
do ->
	try
		crypto = require('crypto')
		sha256 = (value) ->
			hash = crypto.createHash('sha256')
			hash.update(value)
			"$sha256$#{hash.digest('base64')}"
	catch
		shajs = require('sha.js')
		sha256 = (value) ->
			hash = shajs('sha256')
			hash.update(value)
			"$sha256$#{hash.digest('base64')}"
	return {
		types:
			postgres: 'CHAR(54)'
			mysql: 'CHAR(54)'
			websql: 'CHAR(54)'
			odata:
				name: 'Edm.String'

		validateSync: sha256

		validate: (value, required, callback) ->
			if !_.isString(value)
				callback('is not a string')
			else
				hash = sha256(value)
				callback(null, hash)

		compare: (value, result) ->
			hash = sha256(value)
			Promise.resolve(hash == result)
	}
