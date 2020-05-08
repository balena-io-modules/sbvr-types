## sbvr-types

This module defines the data types that can be used in the SBVR model
specification, as well as the possible relations between them. For each data 
type, there is a correspondence with a database data type, according to the 
various database engines that are supported.

The SBVR definition for types can be found at [Type.sbvr](https://github.com/balena-io-modules/sbvr-types/blob/master/Type.sbvr)

"The Rest" can be found at: [balena-io-modules/sbvr-types/src/types](https://github.com/balena-io-modules/sbvr-types/tree/master/src/types)

### How-to

For a new type you should add a module to the types folder. The module should return a single object, which has the following format:

#### types
A types object, which specifies how the type is declared in various systems. This contains:

* postgres/mysql/websql - These can either be a string (which will have the necessity and index appended to it), or a function (necessity, index), which returns the type as a string.

```coffee-script
postgres: 'Serial'
mysql: (necessity, index) ->
	return 'INTEGER' + necessity + index + ' AUTO_INCREMENT'
websql: (necessity, index) ->
	return 'INTEGER' + necessity + index + ' AUTOINCREMENT'
```
* odata - This is an object that must contain a "name" property, which is a string specifying the name of the OData type. It may also contain a "complexType" property, which is a string that specifies an OData ComplexType

```coffee-script
odata:
	name: 'Edm.Int64'
```
```coffee-script
odata:
	name: 'Self.Color'
	complexType: '''
		<ComplexType Name="Color">
			 <Property Name="r" Nullable="false" Type="Edm.Int8"/>\
			 <Property Name="g" Nullable="false" Type="Edm.Int8"/>\
			 <Property Name="b" Nullable="false" Type="Edm.Int8"/>\
			 <Property Name="a" Nullable="false" Type="Edm.Int8"/>\
		</ComplexType>'''
```

* validate - This is a function `(value, required) => Promise` that must be provided, and which should validate that incoming data is valid for this type.
	* `value` is the value that has been received as part of the request.
	* `required` specifies whether this value is required (true: NOT NULL, false: NULL).
	* `Promise` should be returned with the resolved value being the valid, processed data, and any rejection being an error message explaining why the data is invalid.

An example of validating a `Color` type, we accept either a number that specifies the `Color`, or an object {'r' or 'red', 'g' or 'green', 'b' or 'blue', 'a' or 'alpha'}, and return an integer that represents the `Color`.

```coffee-script
validate: Promise.method (value, required) ->
	if typeof value != 'object'
		processedValue = parseInt(value, 10)
		if Number.isNaN(processedValue)
			throw new Error('is neither an integer or color object: ' + value)
	else
		processedValue = 0
		for own component, componentValue of value
			if Number.isNaN(componentValue) or componentValue > 255
				throw new Error('has invalid component value of ' + componentValue + ' for component ' + component)
			switch component.toLowerCase()
				when 'r', 'red'
					processedValue |= componentValue << 16
				when 'g', 'green'
					processedValue |= componentValue << 8
				when 'b', 'blue'
					processedValue |= componentValue
				when 'a', 'alpha'
					processedValue |= componentValue << 24
				else
					throw new Error('has an unknown component: ' + component)
	return processedValue
```

* fetchProcessing - This is a function `(data) => any` that may be specified to process the data after fetching from the database and before sending to the client. If specified this function should return the modified data

```coffee-script
fetchProcessing: (data) ->
	return {
		r: (data >> 16) & 0xFF
		g: (data >> 8) & 0xFF
		b: data & 0xFF
		a: (data >> 24) & 0xFF
	}
```

* nativeProperties - This is an object that may be specified to define "native" properties of the type.
If specified it should match the format:

```coffee-script
nativeProperties:
	Verb:
		Term: (from) -> ...
		Term2: (from) -> ...
	Verb2:
		Term3: (from) -> ...
```

The `(from) -> ...` function should return a chunk of abstract sql that can be used to fetch the property specified by this fact type, the `from` parameter is abstract sql that will refer to an instance of the term that is of this type.

Text has Length:

```coffee-script
	nativeProperties:
		'has':
			'Length': (from) -> ['CharacterLength', from]
```

For the various properties of Color:

```coffee-script
nativeProperties:
	'has':
		'Red Component': (from) -> ['BitwiseAnd', ['BitwiseShiftRight', from, 16], 255]
		'Green Component': (from) -> ['BitwiseAnd', ['BitwiseShiftRight', from, 8], 255]
		'Blue Component': (from) -> ['BitwiseShiftRight', from, 255]
		'Alpha Component': (from) -> ['BitwiseAnd', ['BitwiseShiftRight', from, 24], 255]
```

* nativeFactTypes - This is an object that may be specified to define "native" fact types of the type. If specified it should match the format:

```coffee-script
nativeFactTypes:
	'Term':
		'Verb1': (from, to) -> ...
		'Verb2': (from, to) -> ...
	'Term2':
		'Verb3': (from, to) -> ...
```

The `(from, to) -> ...` function should return a chunk of abstract sql that can be used to resolve this fact type.  
The `from` parameter is abstract sql that will refer to an instance of the term that is of this type.  
The `to`  parameter is abstract sql that will refer to an instance of the term that is of the type specified by the property name.  

Note: The reasoning the ordering of this is `SecondTerm -> Verb`, rather than `Verb -> SecondTerm` is that it allows declaring all the links between two terms much easier (as you will see in the examples)

A selection of the the native fact types for Integer (in the actual file much more DRY is practiced):

```coffee-script
nativeFactTypes:
	'Integer':
		'is greater than': (from, to) -> ['GreaterThan', from, to]
		'is greater than or equal to': (from, to) -> ['GreaterThanOrEqual', from, to]
		'is less than': (from, to) -> ['LessThan', from, to]
		'is less than or equal to': (from, to) -> ['LessThanOrEqual', from, to]
	'Real':
		'is greater than': (from, to) -> ['GreaterThan', from, to]
		'is greater than or equal to': (from, to) -> ['GreaterThanOrEqual', from, to]
		'is less than': (from, to) -> ['LessThan', from, to]
		'is less than or equal to': (from, to) -> ['LessThanOrEqual', from, to]
```


### Tests

Tests can be found under the `test/` folder, to run the whole suite use `npm test`
