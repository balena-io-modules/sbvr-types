_ = require('lodash')
Promise = require('bluebird')
TypeUtils = require('../type-utils')
typeFunc = (necessity, index, defaultValue = ' DEFAULT 0') ->
	return 'INTEGER' + defaultValue + necessity + index
module.exports = {
	types:
		postgres: typeFunc
		mysql: typeFunc
		websql: typeFunc
		odata:
			name: 'Edm.Boolean'

	fetchProcessing: Promise.method (data) ->
		return data == 1

	validate: TypeUtils.validate.checkRequired (originalValue) ->
		# We use Number rather than parseInt as it deals with booleans and will return NaN for things like "a1"
		value = Number(originalValue)
		if _.isNaN(value) or value not in [0, 1]
			throw new Error("is not a boolean: #{JSON.stringify(originalValue)} (#{typeof originalValue})")
		else
			return value
}
