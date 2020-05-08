const equality = (from: string, to: string) => ['Equals', from, to];
const checkRequired = <T>(validateFn: (value: any) => T) => {
	function runCheck(value: any, required: true): Promise<T>;
	function runCheck(value: undefined | null, required: false): Promise<null>;
	function runCheck<U>(value: U, required: boolean): Promise<T | null>;
	async function runCheck<U>(value: U, required: boolean): Promise<T | null> {
		if (value == null) {
			if (required) {
				throw new Error('cannot be null');
			}
			return null;
		}
		return validateFn(value);
	}
	return runCheck;
};

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
		if (Number.isNaN(processedValue)) {
			throw new Error('is not a number: ' + value);
		} else {
			return processedValue;
		}
	}),
	text: (length?: number) =>
		checkRequired((value: any) => {
			if (typeof value !== 'string') {
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
		if (Number.isNaN(processedValue)) {
			processedValue = value;
		}
		const processedDate = new Date(processedValue);
		if (Number.isNaN(processedDate.getTime())) {
			throw new Error('is not a valid date: ' + value);
		} else {
			return processedDate;
		}
	}),
};
