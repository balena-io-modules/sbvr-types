# Change Log

All notable changes to this project will be documented in this file
automatically by Versionist. DO NOT EDIT THIS FILE MANUALLY!
This project adheres to [Semantic Versioning](http://semver.org/).

# v11.1.1
## (2025-08-01)

* Update dev dependencies [Pagan Gazzard]

# v11.1.0
## (2025-07-31)

* Add the 'is represented by Text' property to the JSON type [Thodoris Greasidis]

# v11.0.0
## (2025-07-15)

* Update DateTime to include time zone information [Josh Bowling]

# v10.1.0
## (2025-06-19)

* Extend webresource write type with File api [Otavio Jacobi]

# v10.0.0
## (2025-06-19)

* Drop support for no longer maintained node 16 & 18 [Otavio Jacobi]

# v9.2.6
## (2025-06-07)

* Update dependency lint-staged to v16 [balena-renovate[bot]]

# v9.2.5
## (2025-04-11)

* Update dependency bcryptjs to v3 [balena-renovate[bot]]

# v9.2.4
## (2025-04-10)

* Update @balena/lint to 9.x [Pagan Gazzard]

# v9.2.3
## (2025-04-09)

* Update dependency mocha to v11 [balena-renovate[bot]]

# v9.2.2
## (2025-03-24)

* Update dependency @balena/abstract-sql-compiler to v10 [balena-renovate[bot]]

# v9.2.1
## (2025-03-24)

* Update dependency @types/chai-datetime to v1 [balena-renovate[bot]]

# v9.2.0
## (2025-02-24)

* Use big integer for webresource casting type [Otavio Jacobi]

# v9.1.0
## (2024-10-24)

* Add `is case insensitively equal to` for Text types [Otavio Jacobi]

# v9.0.2
## (2024-09-17)

* Change the exported Types to an interface so that they can be augmented [Thodoris Greasidis]

# v9.0.1
## (2024-08-05)

* Update @balena/lint to v8.2.7 [Josh Bowling]

# v9.0.0
## (2024-08-02)

* Update BigInteger and BigSerial TsTypes [Josh Bowling]

# v8.0.0
## (2024-06-12)

* Improve BigInteger and BigSerial support [Josh Bowling]

# v7.1.3
## (2024-06-12)

* Add typings for all abstract sql fragments, fixing where necessary [Pagan Gazzard]

# v7.1.2
## (2024-06-12)

* Explicitly type the `compare` function for `hashed` [Pagan Gazzard]

# v7.1.1
## (2024-06-04)

* Accept `Date` for the write types of `Date Time`/`Date`/`Time` [Pagan Gazzard]

# v7.1.0
## (2024-04-25)

* Export typescript read/write types for each sbvr type [Pagan Gazzard]

# v7.0.10
## (2024-04-09)

* Update Big Serial concept type to Big Integer [Josh Bowling]

# v7.0.9
## (2024-04-09)

* Add Big Serial to Type.sbvr [Josh Bowling]

# v7.0.8
## (2024-04-09)

* Update prepare script for husky v9 [Josh Bowling]
* Update dependency husky to v9 [Self-hosted Renovate Bot]

# v7.0.7
## (2024-04-09)

* Update dependency @balena/lint to v8 [Self-hosted Renovate Bot]

# v7.0.6
## (2024-03-21)

* Improve JSON typings [Pagan Gazzard]

# v7.0.5
## (2024-03-13)

* Remove unnecessary catch bindings [Pagan Gazzard]

# v7.0.4
## (2024-03-13)

* Improve validate typings [Pagan Gazzard]

# v7.0.3
## (2024-03-12)

* Improve fetchProcessing typings [Pagan Gazzard]

# v7.0.2
## (2024-03-12)

* Tests: convert to typescript [Pagan Gazzard]

# v7.0.1
## (2024-03-04)

* Update dependency @balena/abstract-sql-compiler to v9 [Self-hosted Renovate Bot]

# v7.0.0
## (2024-03-04)

* Return `ISODateString` instead of `date` [fisehara]

# v6.1.1
## (2024-01-02)

* Update dependency @types/chai-datetime to ^0.0.39 [Self-hosted Renovate Bot]

# v6.1.0
## (2023-10-03)

* Add checksum to WebResource [Otávio Jacobi]

# v6.0.0
## (2023-08-09)

* Change contents to snake_case [Otávio Jacobi]

# v5.2.0
## (2023-08-08)

* Expose WebResource as WebResourceType [Otávio Jacobi]

# v5.1.0
## (2023-08-03)

* Adds WebResource type [Otávio Jacobi]

# v5.0.0
## (2023-05-16)

* Switch from `export =` to `export default` [Pagan Gazzard]

# v4.0.2
## (2023-05-03)

* Improve typings [Pagan Gazzard]

# v4.0.1
## (2023-05-02)

* boolean: Avoid unnecessary array creation to reduce GCs [Thodoris Greasidis]

# v4.0.0
## (2023-04-26)

* Add test cases for Objects in JSON validate [fisehara]
* Drop `require-npm4-to-publish` devDependency [fisehara]
* Set minimum supported nodejs version to 16.13.0 and tsconfig to es2021 [Pagan Gazzard]
* Switch `JSON` to use `JSON` db type instead of `TEXT` [Pagan Gazzard]
* Switch `Boolean` to use `BOOLEAN` db type instead of `INTEGER` [Pagan Gazzard]
* Assert that JSON input typeof is object [Josh Bowling]

# v3.5.0
## (2023-03-21)

* Add Big Serial type [Josh Bowling]

# v3.4.19
## (2022-12-08)

* Flowzone: Allow external contributions [Josh Bowling]

# v3.4.18
## (2022-11-25)

* Tests: remove chai-as-promised [Pagan Gazzard]
* Tests: remove bluebird [Pagan Gazzard]
* Tests: remove lodash [Pagan Gazzard]

# v3.4.17
## (2022-11-25)

* Update dependencies [Pagan Gazzard]

# v3.4.16
## (2022-11-25)

* Switch from `new Buffer` to `Buffer.from` to avoid deprecation warnings [Pagan Gazzard]

# v3.4.15
## (2022-11-18)

* Dev: Migrate husky setup for v8 [Josh Bowling]

# v3.4.14
## (2022-11-17)

* Update dependency mocha to 10.1.0 [Renovate Bot]

# v3.4.13
## (2022-11-17)

* Update dependency lint-staged to 13.0.3 [Renovate Bot]

# v3.4.12
## (2022-11-17)

* Update dependency husky to 8.0.2 [Renovate Bot]

# v3.4.11
## (2022-11-17)

* Dev: Add lint-fix npm script [Josh Bowling]

# v3.4.10
## (2022-11-17)

* Dev: Move type deps to dev [Josh Bowling]

# v3.4.9
## (2022-11-17)

* Add .npmrc [Josh Bowling]

# v3.4.8
## (2022-10-14)

* Switch from balenaCI to flowzone [Pagan Gazzard]

# v3.4.7
## (2022-04-08)

* Update dependencies [Pagan Gazzard]
* Remove circleci [Pagan Gazzard]

# v3.4.6
## (2021-09-21)

* Avoid creating a new Date object when we already have one [Pagan Gazzard]

# v3.4.5
## (2021-09-07)

* Convert tests to type checked javascript [Pagan Gazzard]

# v3.4.4
## (2021-06-30)

* Delete CODEOWNERS [Thodoris Greasidis]

# v3.4.3
## (2021-05-11)

* Support boolean results from the db as well as integer [Pagan Gazzard]

# v3.4.2
## (2021-03-22)

* Update dev dependencies [Pagan Gazzard]

# v3.4.1
## (2021-02-10)

* Remove unnecessary native fact type entries for synonymous forms [Pagan Gazzard]

# v3.4.0
## (2021-02-08)

* Add a `Current Time` name that can be used to refer to the current time [Pagan Gazzard]

# v3.3.0
## (2021-02-05)

* Add `is before` & `is after` verbs to the Date & DateTime types [Thodoris Greasidis]

# v3.2.0
## (2021-01-29)

* Add support for the `contains` verb to the text type [Thodoris Greasidis]
* Add support for the`ends with` verb to the text type [Thodoris Greasidis]
* Add support for the `starts with` verb to the text type [Thodoris Greasidis]

# v3.1.3
## (2020-12-11)

* Improve types for `SHA` [Pagan Gazzard]

# v3.1.2
## (2020-11-25)

* Add a `castType` property to type functions [Pagan Gazzard]

# v3.1.1
## (2020-11-25)

* Update dependencies [Pagan Gazzard]

# v3.1.0
## (2020-06-17)

* Update dependencies [Pagan Gazzard]

# v3.0.0
## (2020-05-08)

* Convert `fetchProcessing` to synchronous functions [Pagan Gazzard]
* Update to bcrypt 4.x [Pagan Gazzard]
* Enable strict tsconfig [Pagan Gazzard]
* Make use of `import type` where relevant [Pagan Gazzard]
* Update to balena-lint 5.x [Pagan Gazzard]
* Rename to @balena/sbvr-types [Pagan Gazzard]
* Drop node 8 support [Pagan Gazzard]
* Update tsconfig target to es2018 [Pagan Gazzard]
* Convert all returned promises to native promises instead of bluebird [Pagan Gazzard]

# v2.0.9
## (2020-05-07)

* Switch to balena-lint [Pagan Gazzard]

# v2.0.8
## (2020-05-05)

* Improve typings [Pagan Gazzard]

# v2.0.7
## (2020-04-30)

* Remove unused imports [Pagan Gazzard]

# v2.0.6
## (2020-04-27)

* Remove production lodash dependency [Pagan Gazzard]

## 2.0.5 - 2020-03-17

* CI: Remove circleci deploy in favor of balenaCI [Pagan Gazzard]
* CI: Add node 12 to the test matrix [Pagan Gazzard]
* CI: Remove node 6 from the test matrix [Pagan Gazzard]
* Update dependencies and use resin-lint for automatic lint fixes [Pagan Gazzard]

## 2.0.4 - 2020-01-22

* Add node 12 to the test matrix [Pagan Gazzard]
* Update dependencies [Pagan Gazzard]
* Add CODEOWNERS [Pagan Gazzard]

## 2.0.3 - 2019-05-08

* Add .versionbot/CHANGELOG.yml for downstream changelogs [Pagan Gazzard]

## 2.0.2 - 2019-03-11

* Downgrade @types/bluebird to 3.5.25 to avoid downstream issues [Pagan Gazzard]

## 2.0.1 - 2019-03-08

* Convert index to typescript [Pagan Gazzard]
* Convert Time to typescript [Pagan Gazzard]
* Convert Text to typescript [Pagan Gazzard]
* Convert Short Text to typescript [Pagan Gazzard]
* Convert SHA to typescript [Pagan Gazzard]
* Convert Serial to typescript [Pagan Gazzard]
* Convert Real to typescript [Pagan Gazzard]
* Convert JSON to typescript [Pagan Gazzard]
* Convert Interval to typescript [Pagan Gazzard]
* Convert Integer to typescript [Pagan Gazzard]
* Convert Hashed to typescript [Pagan Gazzard]
* Convert ForeignKey to typescript [Pagan Gazzard]
* Convert File to typescript [Pagan Gazzard]
* Convert Date to typescript [Pagan Gazzard]
* Convert Date Time to typescript [Pagan Gazzard]
* Convert ConceptType to typescript [Pagan Gazzard]
* Convert Color to typescript [Pagan Gazzard]
* Convert Case Insensitive Text to typescript [Pagan Gazzard]
* Convert Boolean to typescript [Pagan Gazzard]
* Convert Big Integer to typescript [Pagan Gazzard]
* Convert TypeUtils to typescript [Pagan Gazzard]

## v2.0.0 - 2018-10-10

* Drop bower.json [Pagan Gazzard]
* Drop support for node 4 [Pagan Gazzard]
* Use --require for mocha instead of the deprecated --compilers [Pagan Gazzard]
* Add enforcement of the required flag for validation [Pagan Gazzard]
* Switch to `prepare` to allow installing via git [Pagan Gazzard]
* Remove console.error [Pagan Gazzard]
* Convert to commonjs modules [Pagan Gazzard]
* Switch to throwing/rejecting with actual errors instead of strings [Pagan Gazzard]
* Convert all callback interfaces to promise interfaces [Pagan Gazzard]
* Update dependencies [Pagan Gazzard]
* Update to bcrypt 3.x [Pagan Gazzard]
* Update coffeescript to 2.x [Pagan Gazzard]

## v1.4.2 - 2018-05-08

* Change the storage format of SHA value to fit the P-H-C format. #17 [Andreas Fitzek]

## v1.4.1 - 2018-04-30

* Add node 10 to the circleci tests #15 [Pagan Gazzard]

## v1.4.0 - 2018-04-26

* Add a "SHA" type #14 [Andreas Fitzek]

## v1.3.0 - 2018-03-14

* Add a "Big Integer" type #12 [Pagan Gazzard]

## v1.2.5 - 2018-03-14

* Switch to coffeescript over coffee-script #13 [Pagan Gazzard]
* Update dependencies #13 [Pagan Gazzard]

## v1.2.4 - 2018-03-14

* Enable auto-publishing #11 [Pagan Gazzard]

## v1.2.3 - 2017-09-25

* Added versionist #10 [Giovanni Garufi]

## v1.2.2

* Strictly validate the hex string, rather than rely on validation by nodejs which varies vased on version
* Fixed "File" test for nodejs 8
* Added a "Case Insensitive Text" type

## v1.2.1

* Added linting.
* Added README file.

## v1.2.0

* Return null for null dates rather than the unix epoch.

## v1.1.1

* Fixed bower.json

## v1.1.0

* Updated to lodash ^4.0.0

## v1.0.1

* Update bower.json to match package.json

## v1.0.0

* Updated to bluebird 3.

## v0.1.5

* Made the bcrypt dependencies optional.

## v0.1.4

* Added the ability to specify a default value to database types that are generated via a function.

## v0.1.3

* Switched to being a scoped package.

## v0.1.2

* Added a validate function for the file type so it can actually be used.

## v0.1.1

* Fix an error with Hashed type comparisons introduced in v0.1.0
* Updated lodash to ^3.0.0

## v0.1.0

* Fallback to bcryptjs in the browser rather than unencrypted.
