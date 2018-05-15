import * as _ from 'lodash';

const equality = (from: string, to: string) => ['Equals', from, to];

export const nativeFactTypeTemplates = {
	equality: {
		'is equal to': equality,
		'equals': equality,
	},
	comparison: {
		'is greater than': (from: string, to: string) => ['GreaterThan', from, to],
		'is greater than or equal to': (from: string, to: string) => ['GreaterThanOrEqual', from, to],
		'is less than': (from: string, to: string) => ['LessThan', from, to],
		'is less than or equal to': (from: string, to: string) => ['LessThanOrEqual', from, to],
		'is equal to': equality,
		'equals': equality,
	},
};

export const validate = {
	integer: (value: any, required: boolean, callback: Callback<number>) => {
		let processedValue = _.parseInt(value);
		if (_.isNaN(processedValue)) {
			callback('is not a number: ' + value);
		} else {
			callback(null, processedValue);
		}
	},
	text: (length?:number) => {
		return (value: any, required: boolean, callback: Callback<string>) => {
			if (!_.isString(value)) {
				callback('is not a string: ' + value);
			} else if (_.isNumber(length) && value.length > length) {
				callback('longer than ' + length + ' characters (' + value.length + ')');
			} else {
				callback(null, value);
			}
		};
	},
	date: (value: any, required:boolean, callback:Callback<Date>) => {
		let processedValue: Date;
		let asNumber = Number(value);
		if (_.isNaN(asNumber)) {
			asNumber = value;
		}
		processedValue = new Date(asNumber);
		if (_.isNaN(processedValue.getTime())) {
			callback('is not a valid date: ' + value);
		} else {
			callback(null, processedValue);
		}
	},
};
