import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import types from '../';

// Native properties and names can only be used in a model if Type.sbvr declares them
const vocabulary = fs.readFileSync(
	path.join(__dirname, '..', 'Type.sbvr'),
	'utf8',
);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasLine = (line: string) =>
	new RegExp(`^${escape(line).replace(/ /g, '\\s+')}$`, 'm').test(vocabulary);

describe('Type.sbvr', () => {
	for (const [typeName, type] of Object.entries(types)) {
		if ('nativeProperties' in type) {
			for (const [verb, properties] of Object.entries(type.nativeProperties)) {
				for (const property of Object.keys(properties ?? {})) {
					it(`should declare '${typeName} ${verb} ${property}'`, () => {
						expect(hasLine(`Term: ${property}`), `Term: ${property}`).to.equal(
							true,
						);
						expect(
							hasLine(`Fact type: ${typeName} ${verb} ${property}`),
							`Fact type: ${typeName} ${verb} ${property}`,
						).to.equal(true);
					});
				}
			}
		}
		if ('nativeNames' in type) {
			for (const name of Object.keys(type.nativeNames)) {
				it(`should declare the '${name}' name for '${typeName}'`, () => {
					expect(hasLine(`Name: ${name}`), `Name: ${name}`).to.equal(true);
				});
			}
		}
	}
});
