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

		fetchProcessing: Promise.method (data) ->
			return data == 1

		validate: Promise.method (originalValue, required) ->
			# We use Number rather than parseInt as it deals with booleans and will return NaN for things like "a1"
			value = Number(originalValue)
			if _.isNaN(value) or value not in [0, 1]
				throw "is not a boolean: #{JSON.stringify(originalValue)} (#{typeof originalValue})"
			else
				return value
	}
