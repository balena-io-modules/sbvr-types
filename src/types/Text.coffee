{
	types:
		postgres: 'TEXT'
		mysql: 'TEXT'
		websql: 'TEXT'
		odata:
			name: 'Edm.String'

	nativeProperties:
		has:
			Length: (from) -> ['CharacterLength', from]

	nativeFactTypes:
		Text: TypeUtils.nativeFactTypeTemplates.equality

	validate: TypeUtils.validate.text()

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
