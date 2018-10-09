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

	validate: Promise.method (value, required) ->
		processedValue = parseFloat(value)
		if _.isNaN(processedValue)
			throw new Error('is not a number: ' + value)
		else
			return processedValue
}
