import * as TypeUtils from '../TypeUtils'

export class IntervalSBVR implements SBVRType<number, number> {
	types = {
		postgres: 'INTERVAL',
		mysql: 'INTEGER',
		websql: 'INTEGER',
		odata: {
			name: 'Edm.Int64'
		},
	}

	validate = TypeUtils.validate.integer
}
