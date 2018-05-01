import * as TypeUtils from "../TypeUtils"
import * as _ from 'lodash'

export const DateTime: SBVRType<InternalDate, NullableDate> = {
	types: {
		postgres: 'TIMESTAMP',
		mysql: 'TIMESTAMP',
		websql: 'INTEGER',
		odata: {
			name: 'Edm.DateTime'
		},
	},

	fetchProcessing: (data, callback) => {
		let processedValue: InternalDate
		if(_.isDate(data) || data == null) {
			processedValue = data
		} else {
			processedValue = new Date(data as string)
		}
		callback(null, processedValue)
	},

	validate: TypeUtils.validate.date
}
