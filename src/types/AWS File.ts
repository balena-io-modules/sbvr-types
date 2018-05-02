import * as _ from 'lodash'
import * as moment from 'moment'
import * as crypto from 'crypto'
import * as https from 'https'
import * as aws from 'aws-sdk'

if (process.env.S3_SSL_ENABLED) {
	aws.config.update({
		httpOptions: {
			agent: new https.Agent({ rejectUnauthorized: true })
		}
	})
}
const config = {
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_KEY,
	endpoint: process.env.S3_ENDPOINT,
	s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE ? true : false,
	sslEnabled: process.env.S3_SSL_ENABLED ? true : false,
	signatureVersion: 'v4'
}

export const AWSFile: SBVRType<string, string> = {
	types: {
		postgres: 'TEXT',
		mysql: 'TEXT',
		websql: 'TEXT',
		odata: {
			name: 'Edm.String'
		},
	},

	validate: (value, required, callback) => {
		if (_.isString(value)) {
			if (value.length % 2 != 0) {
				callback('could not be converted to binary: hex string must have an even length')
				return
			}
			if (!/^[a-fA-F0-9]*$/.test(value)) {
				callback('could not be converted to binary: hex string must contain only hex characters')
				return
			}
			try {
				value = new Buffer(value, 'hex')
			} catch (e) {
				callback(`could not be converted to binary: ${e.message}`)
				return
			}	
		}
		if (Buffer.isBuffer(value)) {
			storeFile(value, callback)
			return
		}
		
		return callback(`could not be converted to binary: ${typeof value}`)
	}
}

const generateUniqueKey = () => {
	// Generate date based folder prefix
	const datePrefix = moment().format('YYYY[/]MM');
	const filename =  crypto.randomBytes(10).toString('hex');
	return `${datePrefix}/${filename}`
}

const storeFile = (value: Buffer, callback: Callback<string>) => {
	// Client must be initialised in here to allow mocking in tests
	const client = new aws.S3(config)
	const key = generateUniqueKey()
	const params = {
		Key: key,
		Bucket: process.env.S3_BUCKET || 'Pine',
		Body: value
	}
	client.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
		if (err) {
			const e = new Error('Could not reach S3 storage')
			e.stack = err.stack
			callback(e)
		} else {
			callback(null, data.Location)
		}
	})
}