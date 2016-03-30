{
	types:
		postgres: 'DATE'
		mysql: 'DATE'
		websql: 'INTEGER'
		odata:
			name: 'Edm.DateTime'

	fetchProcessing: (data, callback) ->
		if data?
			data = new Date(data)
		callback(null, data)

	validate: TypeUtils.validate.date
}
