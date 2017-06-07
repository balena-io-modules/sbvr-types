import * as TypeUtils from '../TypeUtils'

class Time implements SBVRType<string, Date> {
	types = {
		  postgres: 'TIME'
		, mysql: 'TIME'
		, websql: 'TEXT'
		, odata: {
			name: 'Edm.DateTime'
		}
	}

	fetchProcessing = (data:string, callback:Callback<Date>) => {
	  // We append the date of the epoch so that we can parse this as a valid date.
		let date = new Date('Thu, 01 Jan 1970 ' + data)
		callback(null, date)

		}

	validate = (value:any, required:boolean, callback:Callback<string>) => {
		TypeUtils.validate.date(value, required, (err, value) => {
			if (err) {
				callback(err)
			} else {
				callback(null, (value as Date).toLocaleTimeString())
			}
		})
	}
}
