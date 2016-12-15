{
	types:
		postgres: 'TIMESTAMP'
		mysql: 'TIMESTAMP'
		websql: 'INTEGER'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: (data, callback) ->
		if data?
			data = new Date(data)
		callback(null, data)

	validate: TypeUtils.validate.date

	dataTypeGen: (engine, dataType, necessity, index = '', defaultValue) ->
		if defaultValue != 'CURRENT_TIMESTAMP'
			@validate defaultValue, true, (err, value) ->
				if !err
					defaultValue = value
				else
					defaultValue = null
		dbType = @types?[engine]
		TypeUtils.dataTypeGen dbType, engine, dataType, necessity, index, defaultValue
}
