_ = require('lodash')
TypeUtils = require('../type-utils')
module.exports = {
	types:
		postgres: 'REAL'
		mysql: 'REAL'
		websql: 'REAL'
		odata:
			name: 'Edm.Double'

	nativeFactTypes:
		Integer: TypeUtils.nativeFactTypeTemplates.comparison
		Real: TypeUtils.nativeFactTypeTemplates.comparison

	validate: TypeUtils.validate.checkRequired (value) ->
		processedValue = parseFloat(value)
		if _.isNaN(processedValue)
			throw new Error('is not a number: ' + value)
		else
			return processedValue
}
