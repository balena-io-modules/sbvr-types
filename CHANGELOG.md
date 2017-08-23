* Strictly validate the hex string, rather than rely on validation by nodejs which varies vased on version
* Fixed "File" test for nodejs 8
* Added a "Case Insensitive Text" type

v1.2.1

* Added linting.
* Added README file.

v1.2.0

* Return null for null dates rather than the unix epoch.

v1.1.1

* Fixed bower.json

v1.1.0

* Updated to lodash ^4.0.0

v1.0.1

* Update bower.json to match package.json

v1.0.0

* Updated to bluebird 3.

v0.1.5

* Made the bcrypt dependencies optional.

v0.1.4

* Added the ability to specify a default value to database types that are generated via a function.

v0.1.3

* Switched to being a scoped package.

v0.1.2

* Added a validate function for the file type so it can actually be used.

v0.1.1

* Fix an error with Hashed type comparisons introduced in v0.1.0
* Updated lodash to ^3.0.0

v0.1.0

* Fallback to bcryptjs in the browser rather than unencrypted.
