import * as bcrypt from 'bcrypt'
import * as _ from 'lodash'

export class HashedSBVR implements SBVRType<string, string> {

	types = {
		postgres: 'CHAR(60)',
		mysql: 'CHAR(60)',
		websql: 'CHAR(60)',
		odata: {
			name: 'Edm.String'
		},
	}

	validate = (value:string, required:boolean, callback:Callback<string>) => {
		if (!_.isString(value)) {
			callback('is not a string')
		} else {
			bcrypt.genSalt()
			.then( (salt:string) => bcrypt.hash(value, salt) )
			.then(callback)
		}
	}
	compare = _.bind(bcrypt.compare, bcrypt)
}
