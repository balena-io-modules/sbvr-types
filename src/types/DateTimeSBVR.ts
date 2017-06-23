import * as TypeUtils from "../TypeUtils"

type InternalDate = Date | number

export class DateTimeSBVR implements SBVRType<InternalDate, Date> {
	types = {
		postgres: 'TIMESTAMP',
		mysql: 'TIMESTAMP',
		websql: 'INTEGER',
		odata: {
			name: 'Edm.DateTime'
		},
	}
	fetchProcessing =  (data:InternalDate, callback:Callback<Date>) => {
		callback(null, new Date(data))
	}

	validate = TypeUtils.validate.date
}
