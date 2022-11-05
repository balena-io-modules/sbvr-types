import * as TypeUtils from '../type-utils';
import { URL } from 'url';

export const types = {
	postgres: 'TEXT',
	mysql: 'TEXT',
	websql: 'TEXT',
	odata: {
		name: 'Edm.String', // TODO: What should this really be?
	},
};

export const fetchProcessing = (data: any) => data;

export const validate = TypeUtils.validate.checkRequired((value) => {
	try {
		const _isURLValid = new URL(value);
		return value;
	} catch {
		throw new Error('Not a valid URL: ' + value);
	}
});
