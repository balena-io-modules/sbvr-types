{
	types:
		postgres: 'BYTEA'
		mysql: 'BLOB'
		websql: 'BLOB'
		odata:
			name: 'Edm.String' # TODO: What should this really be?
	validate: (value, required, callback) ->
		if Buffer.isBuffer(value)
			callback(null, value)
		else if _.isString(value)
			try
				value = new Buffer(value, 'hex')
			catch e
				callback("could not be converted to binary: #{e.message}")
				return
			callback(null, value)
		else
			callback("could not be converted to binary: #{typeof value}")

	dataTypeGen: (engine, dataType, necessity, index = '', defaultValue) ->
		if defaultValue
			@validate defaultValue, true, (err, value) ->
				if !err
					defaultValue = value
				else
					defaultValue = null
		dbType = @types?[engine]
		TypeUtils.dataTypeGen dbType, engine, dataType, necessity, index, defaultValue
}
