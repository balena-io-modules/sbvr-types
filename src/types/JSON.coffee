{
	types:
		postgres: 'TEXT'
		mysql: 'TEXT'
		websql: 'TEXT'
		odata:
			name: 'Edm.String' # TODO: What should this really be?

	fetchProcessing: (data, callback) ->
		try
			callback(null, JSON.parse(data))
		catch e
			callback(e)

	validate: (value, required, callback) ->
		try
			callback(null, JSON.stringify(value))
		catch e
			console.error(e)
			callback('cannot be turned into JSON: ' + value)

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
