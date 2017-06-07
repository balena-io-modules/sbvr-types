class FileT implements SBVRType<Buffer, any> {
	types = {
		  postgres: 'BYTEA'
		, mysql: 'BLOB'
		, websql: 'BLOB'
		, odata: {
			name: 'Edm.String' // TODO: What should this really be?
		}
	}
	validate = (value:any, required:boolean, callback:Callback<Buffer>) => {
		if(Buffer.isBuffer(value)) {
			callback(null, value)
		}
		else if (_.isString(value)) {
			try {
				value = new Buffer(value, 'hex')
			} catch (e) {
				callback("could not be converted to binary: #{e.message}")
				return
			}
			callback(null, value)
		} else {
			callback("could not be converted to binary: #{typeof value}")
		}
	}
}
