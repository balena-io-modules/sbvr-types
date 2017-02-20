{
	types:
		postgres: 'REAL'
		mysql: 'REAL'
		websql: 'REAL'
		odata:
			name: 'Edm.Double'

	nativeFactTypes:
		Integer: TypeUtils.nativeFactTypeTemplates.comparison
		Real: TypeUtils.nativeFactTypeTemplates.comparison

	validate: (value, required, callback) ->
		processedValue = parseFloat(value)
		if _.isNaN(processedValue)
			callback('is not a number: ' + value)
		else
			callback(null, processedValue)

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
