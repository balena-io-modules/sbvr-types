import * as helpers from './helpers';

const s3Object = {
	filename: 'logo.png',
	href: 'http://s3.awsobject.com/bucket/object1',
	contentType: 'image/png',
	contentDisposition: null,
	size: 65536,
};

helpers.describe('WebResource', (test) => {
	describe('fetchProcessing', () => {
		test.fetch(JSON.stringify(s3Object), s3Object);
	});

	describe('validate', () => {
		test.validate(s3Object, true, s3Object);
	});
});
