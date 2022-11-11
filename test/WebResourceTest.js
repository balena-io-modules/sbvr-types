import * as helpers from './helpers';
import * as chai from 'chai';
import * as chaiDateTime from 'chai-datetime';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiDateTime);
chai.use(chaiAsPromised);

const { expect } = chai;

const s3ObjectRef = {
	filename: 'logo.png',
	href: 'http://s3.awsobject.com/bucket/object1',
	contentType: 'image/png',
	contentDisposition: null,
	size: 65536,
};

const hex = '5261777221';
const buf = Buffer.from(hex, 'hex');

const s3ObjectSource = {
	filename: 'logo.png',
	data: buf,
	contentType: 'image/png',
	contentDisposition: null,
	size: 65536,
};

helpers.describe('WebResource', (test) => {
	describe('fetchProcessing', () => {
		test.fetch(JSON.stringify(s3ObjectRef), s3ObjectRef);
	});

	describe('validate', () => {
		test.validate(s3ObjectSource, true, (value) => {
			expect(typeof value).to.equal('string');
			const asObj = JSON.parse(value);
			expect(asObj.filename).to.equal(s3ObjectSource.filename);
			const s3UrlRE =
				/^https?:\/\/(?<bucket>.*)\.s3\.(?<region>.*)\.amazonaws\.com\/(?<key>.*)$/;
			expect(asObj.href).to.match(s3UrlRE);
		});
	});
});
