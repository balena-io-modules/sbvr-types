import { expect } from 'chai';
import types from '../';

// The primitive types of OData v2, which is the version of the pinejs $metadata
const primitiveTypes = new Set([
	'Edm.Binary',
	'Edm.Boolean',
	'Edm.Byte',
	'Edm.DateTime',
	'Edm.DateTimeOffset',
	'Edm.Decimal',
	'Edm.Double',
	'Edm.Guid',
	'Edm.Int16',
	'Edm.Int32',
	'Edm.Int64',
	'Edm.SByte',
	'Edm.Single',
	'Edm.String',
	'Edm.Time',
]);

describe('OData types', () => {
	for (const [typeName, { types: dbTypes }] of Object.entries(types)) {
		const odata: { name: string; complexType?: string } = dbTypes.odata;
		it(`should use a valid type for '${typeName}'`, () => {
			if (odata.complexType == null) {
				expect(primitiveTypes).to.include(odata.name);
				return;
			}
			const complexTypeName = odata.complexType.match(
				/<ComplexType Name="([^"]+)">/,
			)?.[1];
			expect(odata.name).to.equal(`Self.${complexTypeName}`);
			const propertyTypes = [
				...odata.complexType.matchAll(/<Property [^>]*Type="([^"]+)"/g),
			].map(([, propertyType]) => propertyType);
			expect(propertyTypes).to.not.be.empty;
			for (const propertyType of propertyTypes) {
				expect(primitiveTypes).to.include(propertyType);
			}
		});
	}
});
