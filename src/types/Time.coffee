{
	types:
		postgres: 'TIME'
		mysql: 'TIME'
		websql: 'TEXT'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: (data, callback) ->
		if data?
			# We append the date of the epoch so that we can parse this as a valid date.
			data = new Date('Thu, 01 Jan 1970 ' + data)
		callback(null, data)

	validate: (value, required, callback) ->
		TypeUtils.validate.date value, required, (err, value) ->
			if err
				callback(err)
				return
			callback(null, value.toLocaleTimeString())

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
