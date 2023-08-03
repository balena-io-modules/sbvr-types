import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';
import types from '../';
import * as util from 'util';

chai.use(chaiDateTime);

const { expect } = chai;

const $describe = (typeName, fn) => {
	const type = types[typeName];
	const test = function (methodName) {
		/** @type {any} */
		let method = type;
		if (!Array.isArray(methodName)) {
			methodName = [methodName];
		}
		for (const n of methodName) {
			method = method[n];
		}
		if (typeof method !== 'function') {
			const v = method;
			method = () => v;
		}

		return function (...inputs) {
			const expected = inputs.pop();
			if (expected instanceof Error) {
				it(`should reject ${util.inspect(inputs)} with ${
					expected.message
				}`, async () => {
					let err;
					try {
						await method(...inputs);
					} catch (e) {
						err = e;
					}
					expect(err)
						.to.be.an('error')
						.that.has.a.property('message')
						.that.equals(expected.message);
				});
			} else {
				const isFunc = typeof expected === 'function';
				const matches = isFunc
					? 'pass custom tests'
					: `return ${util.inspect(expected)}`;
				it(`should accept ${util.inspect(
					inputs,
				)} and ${matches}`, async function () {
					const result = await method(...inputs);
					if (isFunc) {
						return expected(result);
					} else if (expected instanceof Date) {
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
				postgres: test(['types', 'postgres']),
				mysql: test(['types', 'mysql']),
				websql: test(['types', 'websql']),
			},
			fetch: test('fetchProcessing'),
			validate: test('validate'),
		}),
	);
};

export { $describe as describe };
