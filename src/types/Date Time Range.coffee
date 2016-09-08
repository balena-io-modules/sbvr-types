{
	types:
		postgres: 'TSTZRANGE'
		mysql: 'VARCHAR(255)'
		websql: 'VARCHAR(255)'
		odata:
			name: 'Self.DateTimeRange'
			complexType: '''
				<ComplexType Name="DateTimeRange">
					 <Property Name="Begin" Nullable="false" Type="Edm.DateTime"/>\
					 <Property Name="End" Nullable="true" Type="Edm.DateTime"/>\
					 <Property Name="Bounds" Nullable="false" Type="Edm.String"/>\
				</ComplexType>'''

	nativeProperties:
		has:
			Begin: (from) -> ['RangeBegin', from]
			End: (from) -> ['RangeEng', from]
			Bounds: (from) -> ['RangeBounds', from]

	fetchProcessing: (data, callback) ->
		if data?
			res =
				Begin: data.split(',')[0].slice(1)
				End: data.split(',')[1].trim().slice(0, -1)
				Bounds: data[0] + data[data.length - 1]
			callback(null, res)
		else
			callback(null, data)

	validate: (value, required, callback) ->
		if !_.isObject(value)
			callback('is not a date time range object: ' + value)
		else
			# Check with hasOwnProperty since null values are allowed
			if value.hasOwnProperty('Begin') and value.hasOwnProperty('End') and value.hasOwnProperty('Bounds')
				processedValue = ''
				begin = undefined
				end = undefined
				bounds = undefined
				for own component, componentValue of value
					switch component.toLowerCase()
						when 'begin'
							begin = componentValue
						when 'end'
							end = componentValue
						when 'bounds'
							bounds = componentValue
						else
							callback('has an unknown component: ' + component)
				processedValue = bounds[0] + begin + ', ' + end + bounds[1]
				callback(null, processedValue)
			else
				callback('has unknown components: ' + value)
}