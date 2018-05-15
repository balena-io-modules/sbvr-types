import * as TypeUtils from '../TypeUtils';

export const Time: SBVRType<string | null, NullableDate> = {
	types: {
		postgres: 'TIME',
		mysql: 'TIME',
		websql: 'TEXT',
		odata: {
			name: 'Edm.DateTime',
		},
	},

	fetchProcessing: (data, callback) => {
		let date: NullableDate;
		if (data != null) {
			// We append the date of the epoch so that we can parse this as a valid date.
			date = new Date('Thu, 01 Jan 1970 ' + data);
		} else {
			date = null;
		}
		callback(null, date);
	},

	validate: (value, required, callback) => {
		TypeUtils.validate.date(value, required, (err, response) => {
			if (err) {
				callback(err);
			} else {
				callback(null, response!.toLocaleTimeString());
			}
		});
	},
};
