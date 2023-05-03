export interface DatabaseTypeFn {
	(necessity: string, index: string): string;
	castType: string;
}
export type DatabaseType = string | DatabaseTypeFn;
export interface SbvrType {
	types: {
		odata: {
			name: string;
			complexType?: string;
		};
		postgres: DatabaseType;
		mysql: DatabaseType;
		websql: DatabaseType;
	};
	fetchProcessing?: (field: any) => any;
	validate: (value: any, required: boolean) => Promise<any>;
}

const checkRequired = <T>(validateFn: (value: any) => T) => {
	function runCheck(value: any, required: true): Promise<T>;
	function runCheck(value: undefined | null, required: false): Promise<null>;
	function runCheck(value: any, required: boolean): Promise<T | null>;
	async function runCheck(value: any, required: boolean): Promise<T | null> {
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

const equality = {
	'is equal to': (from: string, to: string) => ['Equals', from, to],
};
export const nativeFactTypeTemplates = {
	equality,
	comparison: {
		'is less than': (from: string, to: string) => ['LessThan', from, to],
		'is less than or equal to': (from: string, to: string) => [
			'LessThanOrEqual',
			from,
			to,
		],
		...equality,
	},
};

export const validate = {
	checkRequired,
	integer: checkRequired((value: any) => {
		const processedValue = parseInt(value, 10);
		if (Number.isNaN(processedValue)) {
			throw new Error('is not a number: ' + value);
		}
		return processedValue;
	}),
	text: (length?: number) =>
		checkRequired((value: any) => {
			if (typeof value !== 'string') {
				throw new Error('is not a string: ' + value);
			}
			if (length != null && value.length > length) {
				throw new Error(
					'longer than ' + length + ' characters (' + value.length + ')',
				);
			}
			return value;
		}),
	date: checkRequired((value: any) => {
		let processedValue = Number(value);
		if (Number.isNaN(processedValue)) {
			processedValue = value;
		}
		const processedDate = new Date(processedValue);
		if (Number.isNaN(processedDate.getTime())) {
			throw new Error('is not a valid date: ' + value);
		}
		return processedDate;
	}),
};
