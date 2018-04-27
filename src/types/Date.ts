import * as TypeUtils from '../TypeUtils'
import * as _ from 'lodash'

export const SBVRDate: SBVRType<InternalDate, NullableDate> = {
	types: {
		postgres: 'DATE',
		mysql: 'DATE',
		websql: 'INTEGER',
		odata: {
			name: 'Edm.DateTime'
		},
	},

	fetchProcessing: (data, callback) => {
		let processedValue: Date
		if(_.isDate(data) || data === null) {
			processedValue = data as Date
		} else {
			processedValue = new Date(data as string)
		}
		callback(null, processedValue)
	},

	validate: TypeUtils.validate.date
}
