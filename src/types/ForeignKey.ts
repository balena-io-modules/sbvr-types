import * as TypeUtils from '../TypeUtils'

export const ForeignKey: SBVRType<number, any> = {
	types: {
		postgres: 'INTEGER',
		mysql: 'INTEGER',
		websql: 'INTEGER',
		odata: {
			name: 'Edm.Int64'
		},
	},

	nativeFactTypes: {
		  Integer: TypeUtils.nativeFactTypeTemplates.comparison
		, Real: TypeUtils.nativeFactTypeTemplates.comparison
	},

	validate: TypeUtils.validate.integer
}
