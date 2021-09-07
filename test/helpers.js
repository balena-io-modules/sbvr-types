import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';
import * as chaiAsPromised from 'chai-as-promised';
import * as types from '../';
import * as util from 'util';
import * as _ from 'lodash';
import * as Bluebird from 'bluebird';

chai.use(chaiDateTime);
chai.use(chaiAsPromised);

const { expect } = chai;

const $describe = (typeName, fn) => {
	const type = types[typeName];
	const test = function (methodName, isAsync = true) {
		let method = _.get(type, methodName);
		if (!_.isFunction(method)) {
			method = _.constant(method);
		}
		if (!isAsync) {
			method = Bluebird.method(method);
		}

		return function (...inputs) {
			const expected = inputs.pop();
			if (_.isError(expected)) {
				it(`should reject ${util.inspect(inputs)} with ${
					expected.message
				}`, () =>
					expect(method(...inputs)).to.eventually.be.rejectedWith(
						expected.message,
					));
			} else {
				const isFunc = _.isFunction(expected);
				const matches = isFunc ? 'pass custom tests' : `return ${expected}`;
				it(`should accept ${util.inspect(
					inputs,
				)} and ${matches}`, async function () {
					const result = await method(...inputs);
					if (isFunc) {
						return expected(result);
					} else if (_.isDate(expected)) {
						return expect(result).to.equalDate(expected);
					} else {
						return expect(result).to.deep.equal(expected);
					}
				});
			}
		};
	};

	describe(typeName, () =>
		fn({
			type,
			types: {
				postgres: test('types.postgres', false),
				mysql: test('types.mysql', false),
				websql: test('types.websql', false),
			},
			fetch: test('fetchProcessing', false),
			validate: test('validate'),
		}),
	);
};

export { $describe as describe };
