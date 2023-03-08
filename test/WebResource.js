import * as helpers from './helpers';
import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';

chai.use(chaiDateTime);
const { expect } = chai;

const hex = '5261777221';
const buf = Buffer.from(hex, 'hex');

const webResource = {
	filename: 'logo.png',
	href: 'http://localhost:43680/balena-pine-web-resources/picture_869ba987-b000-471a-90bd-a57538b847bc_450_MB_file.png',
	contentType: 'image/png',
	contentDisposition: null,
	size: buf.byteLength,
};

helpers.describe('WebResource', (test) => {
	describe('fetchProcessing', () => {
		test.fetch(JSON.stringify(webResource), webResource);
	});

	describe('validate not required props absent', () => {
		const smallWebResourceInput = {
			filename: 'logo.png',
			href: 'http://localhost:43680/balena-pine-web-resources/picture_869ba987-b000-471a-90bd-a57538b847bc_450_MB_file.png',
		};
		test.validate(smallWebResourceInput, true, async (value) => {
			expect(typeof value).to.equal('string');
			const asObj = JSON.parse(value);
			expect(asObj.filename).to.equal(smallWebResourceInput.filename);
			expect(asObj.href).to.be.not.null;
		});
	});

	describe('validate not an object', () => {
		test.validate(hex, true, new Error('is not an object: string'));
	});

	describe('validate missing filename', () => {
		const noFilename = {
			href: 'test',
		};
		test.validate(noFilename, true, new Error('filename is required'));
	});

	describe('filename not a string', () => {
		const wrongFilename = {
			filename: { x: 'logo.img' },
			href: 'test',
		};
		test.validate(wrongFilename, true, new Error('filename must be a string'));
	});

	describe('validate no href', () => {
		const { href, ...noHref } = webResource;
		test.validate(noHref, true, new Error('href is required'));
	});

	describe('href not a string', () => {
		const wrongHref = {
			filename: 'logo.png',
			href: new Uint16Array([21, 31]),
		};
		test.validate(wrongHref, true, new Error('href must be a string'));
	});

	describe('content type not a string', () => {
		const wrongContentType = {
			filename: 'logo.png',
			href: 'test',
			contentType: [1, 2, 3],
		};
		test.validate(
			wrongContentType,
			true,
			new Error('contentType must be a string'),
		);
	});

	describe('content disposition not a string', () => {
		const wrongContentDisposition = {
			filename: 'logo.png',
			href: 'test',
			contentDisposition: [1, 2, 3],
		};
		test.validate(
			wrongContentDisposition,
			true,
			new Error('contentDisposition must be a string'),
		);
	});

	describe('size not a integer', () => {
		const basePayload = {
			filename: 'logo.png',
			href: 'test',
		};
		test.validate(
			{ ...basePayload, size: 3.2 },
			true,
			new Error('size must be an integer'),
		);
		test.validate(
			{ ...basePayload, size: '3' },
			true,
			new Error('size must be an integer'),
		);
		test.validate(
			{ ...basePayload, size: [1] },
			true,
			new Error('size must be an integer'),
		);
	});
});
