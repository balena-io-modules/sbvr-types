import * as _bcrypt from 'bcrypt'
import * as _ from 'lodash'

let bcrypt: typeof _bcrypt

try {
	bcrypt = require('bcrypt')
} catch (e) {
	bcrypt = require('bcryptjs')
}

export const Hashed: SBVRType<string, string> = {
	types: {
		postgres: 'CHAR(60)',
		mysql: 'CHAR(60)',
		websql: 'CHAR(60)',
		odata: {
			name: 'Edm.String'
		},
	},

	validate: (value, required, callback) => {
		if (!_.isString(value)) {
			callback('is not a string')
		} else {
			bcrypt.genSalt()
			.then((salt) => bcrypt.hash(value, salt))
			.then((encrypted) => callback(null, encrypted))
			.catch((err) => callback(err))
		}
	},

	compare: _.bind(bcrypt.compare, bcrypt)
}
