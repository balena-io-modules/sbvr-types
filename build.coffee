# This file concatenates all the types into one file with a UMD so that it can easily be required by node/requirejs.

fs = require 'fs'
path = require 'path'
coffee = require 'coffeescript'

indent = (str, times = 1) ->
	str.replace(/\r/g, '').replace(/^/mg, [0...times].map(-> '\t').join(''))

dir = 'src/types'
types = fs.readdirSync(dir).map (fileName) ->
	cs = fs.readFileSync(path.join(dir, fileName), 'utf8')
	cs = indent(cs)
	typeName = fileName.replace(/\.coffee$/, '')
	return JSON.stringify(typeName) + ':\n' + cs

TypeUtils = fs.readFileSync('src/TypeUtils.coffee', 'utf8')

cs = '''
((root, factory) ->
	if typeof define is 'function' and define.amd
		# AMD. Register as an anonymous module.
		define ['lodash', 'bluebird'], (_, Promise) ->
			return (root.SBVRTypes = factory(_, Promise))
	else if typeof exports is 'object'
		# Node. Does not work with strict CommonJS, but
		# only CommonJS-like enviroments that support module.exports,
		# like Node.
		module.exports = factory(require('lodash'), require('bluebird'))
	else
		# Browser globals
		root.SBVRTypes = factory(_, Promise)
) @, (_, Promise) ->
	TypeUtils = ''' + '\n' +
		indent(TypeUtils, 2) + '\n' +
	indent(types.join('\n'))

js = coffee.compile(cs)
fs.writeFileSync('bin/types.js', js, 'utf8')
