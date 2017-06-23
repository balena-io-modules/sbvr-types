import * as TypeUtils from '../TypeUtils'

export class TextSBVR implements SBVRType<string, string> {
	types = {
		postgres: 'TEXT',
		mysql: 'TEXT',
		websql: 'TEXT',
		odata: {
			name: 'Edm.String'
		},
	}
	nativeProperties = {
		has: {
			Length: (from:string) => ['CharacterLength', from]
		}
	}

	nativeFactTypes = {
		Text: TypeUtils.nativeFactTypeTemplates.equality
	}

	validate = TypeUtils.validate.text()
}
