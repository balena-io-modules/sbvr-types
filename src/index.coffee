exports['Big Integer'] = require('./types/big-integer')
exports['Boolean'] = require('./types/boolean')
exports['Case Insensitive Text'] = require('./types/case-insensitive-text')
exports['Color'] = require('./types/color')

types = [
	'ConceptType',
	'Date Time',
	'Date',
	'File',
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
