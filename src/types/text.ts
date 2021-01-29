import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TEXT',
	mysql: 'TEXT',
	websql: 'TEXT',
	odata: {
		name: 'Edm.String',
	},
};

export const nativeProperties = {
	has: {
		Length: (from: string) => ['CharacterLength', from],
	},
};

export const nativeFactTypes = {
	Text: {
		...TypeUtils.nativeFactTypeTemplates.equality,
		'starts with': (from: string, to: string) => ['Startswith', from, to],
	},
};

export const validate = TypeUtils.validate.text();
