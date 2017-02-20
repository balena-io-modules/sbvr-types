{
	types:
		postgres: 'SERIAL'
		mysql: (necessity, index, defaultValue = '') ->
			return 'INTEGER' + defaultValue + necessity + index + ' AUTO_INCREMENT'
		websql: (necessity, index, defaultValue = '') ->
			return 'INTEGER' + defaultValue + necessity + index + ' AUTOINCREMENT'
		odata:
			name: 'Edm.Int64'

	validate: TypeUtils.validate.integer

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
