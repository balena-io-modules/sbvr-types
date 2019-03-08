TypeUtils = require('../type-utils')
module.exports = {
	types:
		postgres: 'INTERVAL'
		mysql: 'INTEGER'
		websql: 'INTEGER'
		odata:
			name: 'Edm.Int64'

	validate: TypeUtils.validate.integer
}
