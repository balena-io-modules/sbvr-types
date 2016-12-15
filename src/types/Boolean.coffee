do ->
	typeFunc = (necessity, index, defaultValue = ' DEFAULT 0') ->
		return 'INTEGER' + defaultValue + necessity + index
	return {
		types:
			postgres: typeFunc
			mysql: typeFunc
			websql: typeFunc
			odata:
				name: 'Edm.Boolean'

		fetchProcessing: (data, callback) ->
			callback(null, data == 1)

		validate: (originalValue, required, callback) ->
			# We use Number rather than parseInt as it deals with booleans and will return NaN for things like "a1"
			value = Number(originalValue)
			if _.isNaN(value) or value not in [0, 1]
				callback("is not a boolean: #{JSON.stringify(originalValue)} (#{typeof originalValue})")
			else
				callback(null, value)

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
