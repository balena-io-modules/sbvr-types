import * as Promise from 'bluebird';
import * as _ from 'lodash';

const equality = (from: string, to: string) => ['Equals', from, to];
const checkRequired = <T>(validateFn: (value: any) => T) =>
	Promise.method((value: any, required: boolean): typeof required extends true
		? T
		: T | null => {
		if (value == null) {
			if (required) {
				throw new Error('cannot be null');
			} else {
				return null;
			}
		}
		return validateFn(value);
	});

export const nativeFactTypeTemplates = {
	equality: {
		'is equal to': equality,
		equals: equality,
	},
	comparison: {
		'is greater than': (from: string, to: string) => ['GreaterThan', from, to],
		'is greater than or equal to': (from: string, to: string) => [
			'GreaterThanOrEqual',
			from,
			to,
		],
		'is less than': (from: string, to: string) => ['LessThan', from, to],
		'is less than or equal to': (from: string, to: string) => [
			'LessThanOrEqual',
			from,
			to,
		],
		'is equal to': equality,
		equals: equality,
	},
};

export const validate = {
	checkRequired,
	integer: checkRequired((value: any) => {
		const processedValue = parseInt(value, 10);
		if (_.isNaN(processedValue)) {
			throw new Error('is not a number: ' + value);
		} else {
			return processedValue;
		}
	}),
	text: (length?: number) =>
		checkRequired((value: any) => {
			if (!_.isString(value)) {
				throw new Error('is not a string: ' + value);
			} else if (length != null && value.length > length) {
				throw new Error(
					'longer than ' + length + ' characters (' + value.length + ')',
				);
			} else {
				return value;
			}
		}),
	date: checkRequired((value: any) => {
		let processedValue = Number(value);
		if (_.isNaN(processedValue)) {
			processedValue = value;
		}
		const processedDate = new Date(processedValue);
		if (_.isNaN(processedDate.getTime())) {
			throw new Error('is not a valid date: ' + value);
		} else {
			return processedDate;
		}
	}),
};
