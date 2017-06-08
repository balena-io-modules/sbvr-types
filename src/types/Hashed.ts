import * as bcryptC from 'bcrypt'
import * as Promise from 'bluebird'
import * as _ from 'lodash'

const bcrypt:any = Promise.promisifyAll(bcryptC)


class Hashed implements SBVRType<string, string> {

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
			bcrypt.genSaltAsync()
			.then( (salt:any) => bcrypt.hashAsync(value, salt) )
			.asCallback(callback)
		}
	}
	compare = _.bind(bcrypt.compareAsync, bcrypt)
}
