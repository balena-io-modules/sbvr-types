do ->
	equality = (from, to) -> ['Equals', from, to]
	return {
		nativeFactTypeTemplates:
			equality:
				'is equal to': equality
				'equals': equality
			comparison:
				'is greater than': (from, to) -> ['GreaterThan', from, to]
				'is greater than or equal to': (from, to) -> ['GreaterThanOrEqual', from, to]
				'is less than': (from, to) -> ['LessThan', from, to]
				'is less than or equal to': (from, to) -> ['LessThanOrEqual', from, to]
				'is equal to': equality
				'equals': equality

		validate:
			integer: (value, required, callback) ->
				processedValue = parseInt(value, 10)
				if _.isNaN(processedValue)
					callback('is not a number: ' + value)
				else
					callback(null, processedValue)
			text: (length) ->
				(value, required, callback) ->
					if !_.isString(value)
						callback('is not a string: ' + value)
					else if length? and value.length > length
						callback('longer than ' + length + ' characters (' + value.length + ')')
					else
						callback(null, value)
			date: (value, required, callback) ->
				processedValue = Number(value)
				if _.isNaN(processedValue)
					processedValue = value
				processedValue = new Date(processedValue)
				if _.isNaN(processedValue.getTime())
					callback('is not a valid date: ' + value)
				else
					callback(null, processedValue)

		dataTypeGen: (dbType, engine, dataType, necessity, index = '', defaultValue) ->
			necessity = if necessity then ' NOT NULL' else ' NULL'
			defaultValue = if defaultValue then " DEFAULT #{defaultValue}"
			if index != ''
				index = ' ' + index
			if dbType?
				if _.isFunction(dbType)
					return dbType(necessity, index)
				defaultValue ?= ''
				return dbType + defaultValue + necessity + index
			else
				throw new Error("Unknown data type '#{dataType}' for engine: #{engine}")
	}
