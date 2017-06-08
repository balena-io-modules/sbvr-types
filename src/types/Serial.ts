import * as TypeUtils from '../TypeUtils'

class Serial implements SBVRType<number, number> {
	types = {
		postgres: 'SERIAL',
		mysql: (necessity:string, index:string, defaultValue:string = '') => {
			return 'INTEGER' + defaultValue + necessity + index + ' AUTO_INCREMENT'
		},
		websql: (necessity:string, index:string, defaultValue:string = '') => {
			return 'INTEGER' + defaultValue + necessity + index + ' AUTOINCREMENT'
		},
		odata: {
			name: 'Edm.Int64'
		},
	}

	validate =  TypeUtils.validate.integer
}
