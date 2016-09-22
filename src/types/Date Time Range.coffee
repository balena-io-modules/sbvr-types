{
	types:
		postgres: 'TSTZRANGE'
		mysql: 'VARCHAR(255)'
		websql: 'VARCHAR(255)'
		odata:
			name: 'Self.DateTimeRange'
			complexType: '''
				<ComplexType Name="DateTimeRange">
					 <Property Name="Start" Nullable="false" Type="Edm.DateTime"/>\
					 <Property Name="End" Nullable="true" Type="Edm.DateTime"/>\
					 <Property Name="Bounds" Nullable="false" Type="Edm.String"/>\
				</ComplexType>'''

	nativeProperties:
		has:
			Start: (from) -> ['RangeStart', from]
			End: (from) -> ['RangeEnd', from]
			Bounds: (from) -> ['RangeBounds', from]

	fetchProcessing: (data, callback) ->
		if data?
			[start, end] = data.slice(1, -1).split(',')
			res =
				Start: start
				End: end.trim()
				Bounds: data[0] + data[data.length - 1]
			callback(null, res)
		else
			callback(null, data)

	validate: (value, required, callback) ->
		if !_.isObject(value)
			callback('is not a date time range object: ' + value)
		else
			# Check with hasOwnProperty since null values are allowed
			if value.hasOwnProperty('Start') and value.hasOwnProperty('End') and value.hasOwnProperty('Bounds')
				processedValue = ''
				start = undefined
				end = undefined
				bounds = undefined
				for own component, componentValue of value
					switch component.toLowerCase()
						when 'start'
							start = componentValue
						when 'end'
							end = componentValue
						when 'bounds'
							bounds = componentValue
						else
							callback('has an unknown component: ' + component)
				processedValue = bounds[0] + start + ', ' + end + bounds[1]
				callback(null, processedValue)
			else
				callback('is missing components: ' + value)
}