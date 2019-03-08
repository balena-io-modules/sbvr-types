exports['Big Integer'] = require('./types/big-integer')
exports['Boolean'] = require('./types/boolean')
exports['Case Insensitive Text'] = require('./types/case-insensitive-text')
exports['Color'] = require('./types/color')
exports['ConceptType'] = require('./types/concept-type')
exports['Date Time'] = require('./types/date-time')
exports['Date'] = require('./types/date')
exports['File'] = require('./types/file')

types = [
	'ForeignKey',
	'Hashed',
	'Integer',
	'Interval',
	'JSON',
	'Real',
	'Serial',
	'SHA',
	'Short Text',
	'Text',
	'Time',
]

for type in types
	exports[type] = require("./types/#{type}")
