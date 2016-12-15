{
	types:
		postgres: 'VARCHAR(255)'
		mysql: 'VARCHAR(255)'
		websql: 'VARCHAR(255)'
		odata:
			name: 'Edm.String'

	validate: TypeUtils.validate.text(255)

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
