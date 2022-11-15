import { S3StorageAdapter } from '../src/storage-adapters/S3StorageAdapter';

// TODO: mock with https://aws.amazon.com/blogs/developer/mocking-modular-aws-sdk-for-javascript-v3-in-unit-tests/
// https://github.com/m-radzikowski/aws-sdk-client-mock

process.env.S3_ENDPOINT = 'http://localhost:43680';
process.env.S3_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
process.env.S3_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

const hex = '62616C656E6142414C454E41';
const buf = Buffer.from(hex, 'hex');
const filename = 'logo.png';

describe('S3StorageAdapter', () => {
	it('should put an object', async () => {
		const adapter = new S3StorageAdapter();
		const webresource = await adapter.saveFile(filename, buf);
		console.log(webresource);
	});

	it('should get and object', async () => {
		console.log('foo');
	});

	it('should put + get an object', async () => {
		const adapter = new S3StorageAdapter();
		const webresource = await adapter.saveFile(filename, buf);
		console.log(webresource);

		const data = await adapter.getFileData(webresource);
		console.log(data);
	});
});
