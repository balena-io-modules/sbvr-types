TypeUtils = require('../type-utils')
module.exports = {
	types:
		postgres: 'SERIAL'
		mysql: (necessity, index, defaultValue = '') ->
			return 'INTEGER' + defaultValue + necessity + index + ' AUTO_INCREMENT'
		websql: (necessity, index, defaultValue = '') ->
			return 'INTEGER' + defaultValue + necessity + index + ' AUTOINCREMENT'
		odata:
			name: 'Edm.Int64'

	validate: TypeUtils.validate.integer
}
