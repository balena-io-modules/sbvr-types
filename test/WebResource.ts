import * as helpers from './helpers';
import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';

chai.use(chaiDateTime);
const { expect } = chai;

helpers.describe('WebResource', (test) => {
	const hex = '5261777221';
	const buf = Buffer.from(hex, 'hex');

	const webResource = {
		filename: 'logo.png',
		href: 'test',
		content_type: 'image/png',
		content_disposition: null,
		size: buf.byteLength,
		checksum: null,
	};
	describe('fetchProcessing', () => {
		test.fetch(JSON.stringify(webResource), webResource);
		test.fetch(JSON.stringify({ ...webResource, checksum: '123' }), {
			...webResource,
			checksum: '123',
		});
	});

	describe('validate not required props absent', () => {
		const smallWebResourceInput = {
			filename: 'logo.png',
			href: 'test',
		};
		test.validate(smallWebResourceInput, true, (value) => {
			expect(typeof value).to.equal('string');
			const asObj = JSON.parse(value);
			expect(asObj.filename).to.equal(smallWebResourceInput.filename);
			expect(asObj.href).to.be.not.null;
		});
	});

	describe('validate when not an object', () => {
		test.validate(hex, true, new Error('is not an object: string'));
	});

	describe('validate for missing filename', () => {
		const noFilename = {
			href: 'test',
		};
		test.validate(
			noFilename,
			true,
			new Error('filename is required and must be a string'),
		);
	});

	describe('validate when filename is not a string', () => {
		const wrongFilename = {
			filename: { x: 'logo.img' },
			href: 'test',
		};
		test.validate(wrongFilename, true, new Error('filename must be a string'));
	});

	describe('validate when href is not present', () => {
		const { href, ...noHref } = webResource;
		test.validate(
			noHref,
			true,
			new Error('href is required and must be a string'),
		);
	});

	describe('validate href is not a string', () => {
		const wrongHref = {
			filename: 'logo.png',
			href: new Uint16Array([21, 31]),
		};
		test.validate(wrongHref, true, new Error('href must be a string'));
	});

	describe('validate content type is not a string', () => {
		const wrongContentType = {
			filename: 'logo.png',
			href: 'test',
			content_type: [1, 2, 3],
		};
		test.validate(
			wrongContentType,
			true,
			new Error('content_type must be a string or undefined'),
		);
	});

	describe('validate content disposition is not a string', () => {
		const wrongContentDisposition = {
			filename: 'logo.png',
			href: 'test',
			content_disposition: [1, 2, 3],
		};
		test.validate(
			wrongContentDisposition,
			true,
			new Error('content_disposition must be a string or undefined'),
		);
	});

	describe('validate size parameter is not an integer', () => {
		const basePayload = {
			filename: 'logo.png',
			href: 'test',
		};
		for (const testParam of [3.2, '3', [1]]) {
			test.validate(
				{ ...basePayload, size: testParam },
				true,
				new Error('size must be an integer or undefined'),
			);
		}
	});

	describe('validate checksum is not a string', () => {
		const wrongChecksum = {
			filename: 'logo.png',
			href: 'test',
			checksum: [1, 2, 3],
		};
		test.validate(
			wrongChecksum,
			true,
			new Error('checksum must be a string or undefined'),
		);
	});
});
