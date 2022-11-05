import * as helpers from './helpers';

const s3Href = 'http://s3.awsobject.com/bucket/object1';

helpers.describe('Web Resource', (test) => {
	describe('fetchProcessing', () => {
		test.fetch(s3Href, s3Href);
	});

	describe('validate', () => {
		test.validate(s3Href, true, s3Href);
	});
});
