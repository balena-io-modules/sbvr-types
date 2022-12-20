import * as helpers from './helpers';
import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';
import {
	getStorageAdapter,
	registerStorageAdapter,
} from '../out/storage-adapters';
import {
	DISK_STORAGE_ADAPTER_NAME,
	DiskStorageAdapter,
} from './storage-adapters/disk-storage-adapter';

chai.use(chaiDateTime);
const { expect } = chai;

registerStorageAdapter(DISK_STORAGE_ADAPTER_NAME, DiskStorageAdapter);

const hex = '5261777221';
const buf = Buffer.from(hex, 'hex');

const webResourceInput = {
	filename: 'logo.png',
	data: buf,
	contentType: 'image/png',
	contentDisposition: null,
	size: buf.byteLength,
	storage: DISK_STORAGE_ADAPTER_NAME,
};

const webResourceRef = {
	filename: webResourceInput.filename,
	href: '/var/tmp/random',
	contentType: webResourceInput.contentType,
	contentDisposition: webResourceInput.contentDisposition,
	size: webResourceInput.size,
};

helpers.describe('WebResource', (test) => {
	describe('fetchProcessing', () => {
		test.fetch(JSON.stringify(webResourceRef), webResourceRef);
	});

	describe('validate', () => {
		test.validate(webResourceInput, true, async (value) => {
			expect(typeof value).to.equal('string');
			const asObj = JSON.parse(value);
			expect(asObj.filename).to.equal(webResourceInput.filename);
			expect(asObj.href).to.be.not.null;

			const fileRef = {
				filename: asObj.filename,
				href: asObj.href,
				storage: DISK_STORAGE_ADAPTER_NAME,
			};
			const loaded = await getStorageAdapter(
				DISK_STORAGE_ADAPTER_NAME,
			).getFileData(fileRef);
			expect(loaded.byteLength).to.equal(webResourceInput.size);
		});
	});
});
