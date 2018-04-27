import * as _ from 'lodash'

class RGBA {
	r: number
	g: number
	b: number
	a: number
}

export const Color: SBVRType<number, RGBA> = {
	types: {
		postgres: 'INTEGER',
		mysql: 'INTEGER',
		websql: 'INTEGER',
		odata: {
			name: 'Self.Color',
			complexType: `
				<ComplexType Name="Color">
					<Property Name="r" Nullable="false" Type="Edm.Int8"/>
					<Property Name="g" Nullable="false" Type="Edm.Int8"/>
					<Property Name="b" Nullable="false" Type="Edm.Int8"/>
					<Property Name="a" Nullable="false" Type="Edm.Int8"/>
				</ComplexType>
			`
			}
	},

	nativeProperties: {
		has: {
			'Red Component': (from:string) => ['BitwiseAnd', ['BitwiseShiftRight', from, 16], 255],
			'Green Component': (from:string) => ['BitwiseAnd', ['BitwiseShiftRight', from, 8], 255],
			'Blue Component': (from:string) => ['BitwiseShiftRight', from, 255],
			'Alpha Component': (from:string) => ['BitwiseAnd', ['BitwiseShiftRight', from, 24], 255],
		}
	},

	fetchProcessing: (data, callback) => {
		callback(null, {
			r: (data >> 16) & 0xFF,
			g: (data >> 8) & 0xFF,
			b: data & 0xFF,
			a: (data >> 24) & 0xFF,
		})
	},

	validate: (value, required, callback) => {
		let processedValue = 0
		if (!_.isObject(value)) {
			processedValue = _.parseInt(value)

			if (_.isNaN(processedValue)) {
				callback(`is neither an integer or color object: ${value}`)
				return
			}
	 	} else {
			_.forOwn(value, (componentValue:number, component:string) => {
				if (_.isNaN(componentValue) || componentValue > 255) {
					callback(`has invalid component value of ${componentValue} for component ${component}`)
					return false
				}
				switch (component.toLowerCase()) {
					case 'r':
					case 'red':
						processedValue |= componentValue << 16
					break

					case 'g':
					case 'green':
						processedValue |= componentValue << 8
					break

					case 'b':
					case 'blue':
						processedValue |= componentValue
					break

					case 'a':
					case 'alpha':
						processedValue |= componentValue << 24
					break
					
					default:
						callback(`has an unknown component: ${component}`)
						return false
				}
			})
		}
		callback(null, processedValue)
	}
}
