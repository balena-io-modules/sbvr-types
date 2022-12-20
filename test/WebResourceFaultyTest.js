import * as helpers from './helpers';
import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';
import { registerStorageAdapter } from '../out/storage-adapters';
import {
	FAULTY_STORAGE_ADAPTER_NAME,
	FaultyStorageAdapter,
} from './storage-adapters/faulty-storage-adapter';

chai.use(chaiDateTime);

registerStorageAdapter(FAULTY_STORAGE_ADAPTER_NAME, FaultyStorageAdapter);

const hex = '5261777221';
const buf = Buffer.from(hex, 'hex');

const webResourceInput = {
	filename: 'logo.png',
	data: buf,
	contentType: 'image/png',
	contentDisposition: null,
	size: buf.byteLength,
	storage: FAULTY_STORAGE_ADAPTER_NAME,
};

helpers.describe('WebResource', (test) => {
	describe('validate', () => {
		test.validate(
			webResourceInput,
			true,
			new Error("can't be saved; error Invalid logo.png of type object"),
		);
	});
});
