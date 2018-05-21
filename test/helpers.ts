const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-datetime'));
import Types from '../src/index';
import * as util from 'util';
import * as _ from 'lodash';
import { expect } from 'chai';

declare global {
	interface SBVRTypeTest<I,O> {
		type: SBVRType<I,O>;
	
		validate(value: any, required: boolean, result: MbDelayed<Nullable<I>>): void;
	
		fetch(data: Nullable<I>, result: MbDelayed<Nullable<O>>): void;
	
		types: any;
	}
	type Delayed<T> = (result: T, done: Function) => void;
	type MbDelayed<T> = Delayed<T> | T | Error;
}

export function runTest<I,O>(typeName: keyof typeof Types, fn: (test: SBVRTypeTest<I,O>) => any) {
	const type = (<any>Types)[typeName];
	const test = (methodName: string, isAsync: boolean = true) => {
		let method : (...args: any[]) => any;
		const _method = _.get(type, methodName);
		if (isAsync) {
			method = _method;
		} else {
			method = (...args: any[]) => {
				const inputs = args.slice(0, args.length - 1);
				const callback = args[args.length - 1];
				try {
					const result = _method.apply(null, inputs);
					callback(null, result);
				} catch (err) {
					callback(err);
				}
			};
		}

		return (...args: any[]) => {
			const inputs = args.slice(0, args.length - 1);
			const expected = args[args.length - 1];
			if (_.isError(expected)) {
				it(`should reject ${util.inspect(inputs)} with ${expected.message}`, (done) => {
					method(...inputs, (err: Error, result: any) => {
						expect(err).to.equal(expected.message);
						expect(result).to.be.undefined;
						done();
					});
					return;
				});
			} else {
				const isFunc = _.isFunction(expected);
				let matches: string;
				if (isFunc) {
					matches = 'pass custom tests';
				}
				else {
					matches = `return ${expected}`;
				}

				it(`should accept ${util.inspect(inputs)} and ${matches}` , (done) => {
					method(...inputs, (err: Error, result: any) => {
						expect(err).to.not.exist;
						if (isFunc) {
							expected(result, done);
						} else {
							if (_.isDate(result) && _.isDate(expected)) {
								expect(result).to.equalDate(expected);
							} else {
								expect(result).to.deep.equal(expected);
							}
							done();
						}
					});
				});
			}
		};
	};

	describe(typeName, () => {
		fn({
			type: type,
			types: {
				postgres: test('types.postgres', false),
				mysql: test('types.mysql', false),
				websql: test('types.websql', false),
			},
			fetch: test('fetchProcessing'),
			validate: test('validate'),
		});
	});
}
