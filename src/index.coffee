exports['Big Integer'] = require('./types/big-integer')
exports['Boolean'] = require('./types/boolean')
exports['Case Insensitive Text'] = require('./types/case-insensitive-text')
exports['Color'] = require('./types/color')
exports['ConceptType'] = require('./types/concept-type')
exports['Date Time'] = require('./types/date-time')
exports['Date'] = require('./types/date')
exports['File'] = require('./types/file')
exports['ForeignKey'] = require('./types/foreign-key')
exports['Hashed'] = require('./types/hashed')
exports['Integer'] = require('./types/integer')
exports['Interval'] = require('./types/interval')
exports['JSON'] = require('./types/json')

types = [
	'Real',
	'Serial',
	'SHA',
	'Short Text',
	'Text',
	'Time',
]

for type in types
	exports[type] = require("./types/#{type}")
