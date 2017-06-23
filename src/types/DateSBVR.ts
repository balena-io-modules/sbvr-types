import * as TypeUtils from '../TypeUtils'
type InternalDate = Date | number

export class DateSBVR implements SBVRType<Date, Date> {
	types = {
		postgres: 'DATE',
		mysql: 'DATE',
		websql: 'INTEGER',
		odata: {
			name: 'Edm.DateTime'
		},
	}

	fetchProcessing = (data:InternalDate, callback:Callback<Date>) => {
		callback(null, new Date(data))
	}

	validate = TypeUtils.validate.date
}
