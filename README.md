# sbvr-types

This module defines the data types that can be used in the SBVR model specification, as well as the possible relations between them. For each data type, there is a correspondence with a database data type, according to the various database engines that are supported.

The SBVR definition for types can be found at [Type.sbvr](https://github.com/balena-io-modules/sbvr-types/blob/master/Type.sbvr)

"The Rest" can be found at: [balena-io-modules/sbvr-types/src/types](https://github.com/balena-io-modules/sbvr-types/tree/master/src/types)

## How-to

For a new type you should add a module to the types folder. The module should return a single object, which has the following format:

### types

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
		'is less than': (from, to) -> ['LessThan', from, to]
		'is less than or equal to': (from, to) -> ['LessThanOrEqual', from, to]
	'Real':
		'is less than': (from, to) -> ['LessThan', from, to]
		'is less than or equal to': (from, to) -> ['LessThanOrEqual', from, to]
```

Note: You only need to specify the verb for the canonical for of the fact type, any synonymous forms will automatically be remapped to the canonical form

## Tests

Tests can be found under the `test/` folder, to run the whole suite use `npm test`

## Storing files and other large objects

An application can choose between two types to save file content or another large object: `File` or `WebResource`. When using a `File`, PineJS saves the content in the database using a binary data type like `BYTEA` or `BLOB`. When using a `WebResource`, PineJS saves the binary content on an external storage service and then writes metadata, including the content public URL, to the database. Client apps use the `WebResource` `href` to get the content.


### WebResource

Type [`WebResource`](./src//types/web-resource.ts) can be used to persist files or other large content on an external object storage service like MinIO or Amazon S3. By "object storage" we refer to a service that can store the content and provide a URL to access that content.

In order to save a `WebResource` you send an instance of [`WebResourceInput`](./src/types/web-resource.ts#L18)

```js
{
  filename: string;
  data: Buffer;
  contentType?: string;
  contentDisposition?: string;
  size?: number;
  storage: string;
}
```

A typical use case is to have a web app where users can upload a file. The app will use [multer](https://github.com/expressjs/multer) to get the file from the http request as a `Buffer` and pass it as the `data` attribute of a `WebResourceInput`.

When retrieving a `WebResource` the `data` attribute is replaced by an `href`( URL ) attribute. See [`WebResourceRef`](./src/types/web-resource.ts#L7)

#### Storage Adapters

The `storage` attribute specifies the name of an [`StorageAdapter`](./src/storage-adapters/storage-adapter.ts#L7). A `StorageAdapter` saves the content to a specific storage, performing a function similar to what a database driver provides. For example, [pinejs-s3-storage](https://github.com/balena-io-modules/pinejs-s3-storage) saves the content to S3/MinIO and returns a URL to the persisted object. For testing purposes, this module uses [disk-storage-adapter](./test/storage-adapters/disk-storage-adapter.js).

Applications need to load the `StorageAdapter`s they need in the `storageRegistry`(./src/storage-adapters/index.ts#L4). Please refer to each specific storage adapter for more configuration and setup details.
