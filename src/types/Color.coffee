_ = require('lodash')
Promise = require('bluebird')
module.exports = {
	types:
		postgres: 'INTEGER'
		mysql: 'INTEGER'
		websql: 'INTEGER'
		odata:
			name: 'Self.Color'
			complexType: '''
				<ComplexType Name="Color">
					 <Property Name="r" Nullable="false" Type="Edm.Int8"/>\
					 <Property Name="g" Nullable="false" Type="Edm.Int8"/>\
					 <Property Name="b" Nullable="false" Type="Edm.Int8"/>\
					 <Property Name="a" Nullable="false" Type="Edm.Int8"/>\
				</ComplexType>'''

	nativeProperties:
		has:
			'Red Component': (from) -> ['BitwiseAnd', ['BitwiseShiftRight', from, 16], 255]
			'Green Component': (from) -> ['BitwiseAnd', ['BitwiseShiftRight', from, 8], 255]
			'Blue Component': (from) -> ['BitwiseShiftRight', from, 255]
			'Alpha Component': (from) -> ['BitwiseAnd', ['BitwiseShiftRight', from, 24], 255]

	fetchProcessing: Promise.method (data) ->
		return {
			r: (data >> 16) & 0xFF
			g: (data >> 8) & 0xFF
			b: data & 0xFF
			a: (data >> 24) & 0xFF
		}

	validate: Promise.method (value, required) ->
		if !_.isObject(value)
			processedValue = parseInt(value, 10)
			if _.isNaN(processedValue)
				throw new Error('is neither an integer or color object: ' + value)
		else
			processedValue = 0
			for own component, componentValue of value
				if _.isNaN(componentValue) or componentValue > 255
					throw new Error('has invalid component value of ' + componentValue + ' for component ' + component)
				switch component.toLowerCase()
					when 'r', 'red'
						processedValue |= componentValue << 16
					when 'g', 'green'
						processedValue |= componentValue << 8
					when 'b', 'blue'
						processedValue |= componentValue
					when 'a', 'alpha'
						processedValue |= componentValue << 24
					else
						throw new Error('has an unknown component: ' + component)
		return processedValue
}
