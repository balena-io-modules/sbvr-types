const equality = (from:string, to:string) => ['Equals', from, to]
const typeFunc = (necessity:string, index:string, defaultValue:string = ' DEFAULT 0') => {
	return 'INTEGER' + defaultValue + necessity + index
}

const abs = (n:number) => {
	if (n >= 0) {
		return n
	} else {
		return -n
	}
}

class BooleanT implements SBVRType<number, boolean> {
	types = {
		  postgres: typeFunc
		, mysql: typeFunc
		, websql: typeFunc
		, odata: {
			name: 'Edm.Boolean'
		}
	}
	fetchProcessing = (data:number, callback:Callback<boolean>) => {
		callback(null, data == 1)
	}

	validate = (originalValue:any, required:boolean, callback:Callback<number>) => {
		// We use Number rather than parseInt as it deals with booleans and will return NaN for things like "a1"
		let value = Number(originalValue)
		if (_.isNaN(value) || abs(value) >= 2) {
			callback("is not a boolean: #{JSON.stringify(originalValue)} (#{typeof originalValue})")
		}
		else {
			callback(null, value)
		}
	}
}
