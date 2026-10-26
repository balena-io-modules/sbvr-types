import { expect } from 'chai';
import z from 'zod';
import types, { type SbvrType } from '../';

describe('SbvrType', () => {
	const base = {
		types: {
			postgres: 'TEXT',
			mysql: 'TEXT',
			websql: 'TEXT',
			odata: { name: 'Edm.String' },
		},
		validate: types.Text.validate,
		schema: z.string(),
	};

	it('should type the native members of a custom type', () => {
		const customType: SbvrType = {
			...base,
			nativeProperties: {
				has: { Length: (from) => ['CharacterLength', from] },
			},
			nativeFactTypes: {
				Text: { 'is equal to': (from, to) => ['Equals', from, to] },
			},
			nativeNames: { 'Current Time': ['CurrentTimestamp'] },
		};
		expect(
			customType.nativeProperties?.['has']?.['Length']?.([
				'ReferencedField',
				'table',
				'field',
			]),
		).to.deep.equal(['CharacterLength', ['ReferencedField', 'table', 'field']]);
	});

	it('should reject native members that are not abstract sql', () => {
		const customType: SbvrType = {
			...base,
			// @ts-expect-error - a native property must return abstract sql
			nativeProperties: { has: { Length: () => 'length' } },
		};
		expect(customType).to.have.property('nativeProperties');
	});
});
