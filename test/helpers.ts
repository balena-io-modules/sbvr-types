import chai from 'chai';
import chaiDateTime from 'chai-datetime';
import types, { type SbvrType } from '../';
import util from 'util';

chai.use(chaiDateTime);

const { expect } = chai;

type TestFn = (
	...inputs: [
		...unknown[],
		expected:
			| Error
			| null
			| string
			| number
			| bigint
			| boolean
			| Date
			| Buffer
			| unknown[]
			| Record<string, unknown>
			| ((result: any) => void | Promise<void>),
	]
) => void;

const $describe = <T extends keyof typeof types>(
	typeName: T,
	fn: (opts: {
		type: (typeof types)[T];
		types: { postgres: TestFn; mysql: TestFn; websql: TestFn };
		fetch: TestFn;
		validate: TestFn;
	}) => void,
) => {
	const type = types[typeName];
	const test = function (
		method: undefined | string | ((...params: any[]) => any),
	): TestFn {
		if (typeof method !== 'function') {
			const v = method;
			method = () => v;
		}

		return function (...inputs: [...unknown[], expected: unknown]) {
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
						return expect(result).to.equalTime(expected);
					} else {
						return expect(result).to.deep.equal(expected);
					}
				});
			}
		};
	};

	describe(typeName, () => {
		const validate = test(type.validate);
		// This mirrors pinejs, which rejects the request if the schema fails, and otherwise validates the schema's output
		const schemaIntoValidate = test(
			async (value: unknown, required: boolean) => {
				const schema = required
					? type.schema.optional()
					: type.schema.nullish();
				const v = schema.safeParse(value);
				if (!v.success) {
					// So `validate` must reject the values that the schema rejects, and we check its error
					await (type.validate as SbvrType['validate'])(value, required);
					throw new Error(
						`the schema rejects a value that validate accepts: ${v.error.message}`,
					);
				}
				return await (type.validate as SbvrType['validate'])(v.data, required);
			},
		);
		fn({
			type,
			types: {
				postgres: test(type.types.postgres),
				mysql: test(type.types.mysql),
				websql: test(type.types.websql),
			},
			fetch: test('fetchProcessing' in type ? type.fetchProcessing : undefined),
			validate: (...args) => {
				describe('should work with direct validate', () => {
					validate(...args);
				});
				describe('should work with schema parsing into validate', () => {
					schemaIntoValidate(...args);
				});
			},
		});
	});
};

export { $describe as describe };
