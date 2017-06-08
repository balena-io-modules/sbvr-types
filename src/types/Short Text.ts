import * as TypeUtils from '../TypeUtils'

class ShortText implements SBVRType<string, string> {
	types = {
		postgres: 'VARCHAR(255)',
		mysql: 'VARCHAR(255)',
		websql: 'VARCHAR(255)',
		odata: {
			name: 'Edm.String'
		},
	}
	validate = TypeUtils.validate.text(255)
}
