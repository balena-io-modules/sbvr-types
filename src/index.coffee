types = [
	'Big Integer',
	'Boolean',
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
