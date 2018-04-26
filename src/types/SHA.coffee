do ->
	try
		crypto = require('crypto')
		sha256 = (value) ->
			hash = crypto.createHash('sha256')
			hash.update(value)
			"SHA256:HEX:#{hash.digest('hex')}"
	catch
		shajs = require('sha.js')
		sha256 = (value) ->
			hash = shajs('sha256')
			hash.update(value)
			"SHA256:HEX:#{hash.digest('hex')}"
	return {
		types:
			postgres: 'CHAR(76)'
			mysql: 'CHAR(76)'
			websql: 'CHAR(76)'
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
