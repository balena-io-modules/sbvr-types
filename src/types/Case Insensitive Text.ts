import * as TypeUtils from "../TypeUtils"

export const CIText: SBVRType<string, string> = {
	types: {
		postgres: 'CITEXT',
		mysql: 'TEXT COLLATE utf8_unicode_ci',
		websql: 'TEXT COLLATE NOCASE',
		odata: {
			name: 'Edm.String'
		}
	},

	validate: TypeUtils.validate.text()
}

