exports['Big Integer'] = require('./types/big-integer')
exports['Boolean'] = require('./types/boolean')

types = [
	'Case Insensitive Text',
	'Color',
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
