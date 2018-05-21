import * as TypeUtils from '../TypeUtils';

export const ShortText: SBVRType<string, string> = {
	types: {
		postgres: 'VARCHAR(255)',
		mysql: 'VARCHAR(255)',
		websql: 'VARCHAR(255)',
		odata: {
			name: 'Edm.String',
		},
	},

	validate: TypeUtils.validate.whenNotNull(TypeUtils.validate.text(255)),
};
