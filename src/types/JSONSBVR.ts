export class JSONSBVR implements SBVRType<string, JSON> {
	types = {
		postgres: 'TEXT',
		mysql: 'TEXT',
		websql: 'TEXT',
		odata: {
			name: 'Edm.String' // TODO: What should this really be?
		},
	}

 	public fetchProcessing = (data:string, callback:Callback<JSON>) => {
		try {
			callback(null, JSON.parse(data))
		} catch (e) {
			callback(e)
		}
	}

	public validate = (value:any, required:boolean, callback:Callback<string>) => {
		try {
			callback(null, JSON.stringify(value))
		} catch (e) {
			console.error(e)
			callback('cannot be turned into JSON: ' + value)
		}
	}
}