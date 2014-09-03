{
	types:
		postgres: 'DATE'
		mysql: 'DATE'
		websql: 'INTEGER'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: (data, callback) ->
		callback(null, new Date(data))

	validate: TypeUtils.validate.date
}
