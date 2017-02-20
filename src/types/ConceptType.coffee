{
	types:
		postgres: 'INTEGER'
		mysql: 'INTEGER'
		websql: 'INTEGER'
		odata:
			name: 'Edm.Int64'

	nativeFactTypes:
		Integer: TypeUtils.nativeFactTypeTemplates.comparison
		Real: TypeUtils.nativeFactTypeTemplates.comparison

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
