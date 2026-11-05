import { expect } from 'chai';
import z from 'zod';
import types from '../';

describe('Schemas', () => {
	describe('z.compile', () => {
		for (const [typeName, { schema }] of Object.entries(types)) {
			it(`should compile the schema of '${typeName}'`, () => {
				expect(() => z.compile(schema, { strict: true })).to.not.throw();
			});
			// This is how pinejs compiles the schemas to validate a request's values
			it(`should compile the schema of '${typeName}' in an object`, () => {
				expect(() =>
					z.compile(z.looseObject({ field: schema.nullish() }), {
						strict: true,
					}),
				).to.not.throw();
			});
		}
	});

	describe('JSON', () => {
		// The schema JSON replaces, which can't be compiled as it's recursive
		const jsonSchema = z.union([
			z.array(z.json()),
			z.record(z.string(), z.json()),
		]);
		let nested: Record<string, unknown> = {};
		const deep = nested;
		for (let i = 0; i < 50; i++) {
			nested.a = {};
			nested = nested.a as Record<string, unknown>;
		}
		const values: Array<[string, unknown]> = [
			['an empty object', {}],
			['an empty array', []],
			['nested JSON', { a: [1, 'b', true, null, { c: -0 }] }],
			['a deeply nested object', deep],
			['an object without a prototype', Object.create(null)],
			['a NaN', { a: NaN }],
			['an Infinity', { a: Infinity }],
			['an undefined property', { a: undefined }],
			['an undefined array item', [undefined]],
			// eslint-disable-next-line no-sparse-arrays -- holes aren't JSON
			['a sparse array', [, 1]],
			['a nested sparse array', { a: new Array(2) }],
			['a bigint', { a: 1n }],
			['a function', { a: () => 1 }],
			['a symbol', { a: Symbol('a') }],
			['a Date', new Date(0)],
			['a nested Date', { a: new Date(0) }],
			['a toJSON object', { a: { toJSON: () => 1 } }],
			[
				'a class instance',
				{
					a: new (class Foo {
						bar = 1;
					})(),
				},
			],
			['a Map', new Map()],
			['a Buffer', Buffer.from('a')],
			['a boxed number', { a: Object(1) }],
			['a string', 'a'],
			['a number', 1],
			['null', null],
		];
		for (const [description, value] of values) {
			it(`should match z.json() for ${description}`, () => {
				const result = types.JSON.schema.safeParse(value);
				const expected = jsonSchema.safeParse(value);
				expect(result.success).to.equal(expected.success);
				expect(JSON.stringify(result.data)).to.equal(
					JSON.stringify(expected.data),
				);
			});
		}
		// `z.json()` copies objects, which drops a `__proto__` key as the copy sets the prototype instead
		it('should keep a parsed __proto__ key', () => {
			const value = JSON.parse('{"__proto__":{"a":1},"b":2}');
			expect(JSON.stringify(types.JSON.schema.parse(value))).to.equal(
				'{"__proto__":{"a":1},"b":2}',
			);
		});
	});
});
