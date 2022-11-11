import * as TypeUtils from '../type-utils';
import * as _ from 'lodash';
import { S3StorageAdapter } from '../storage-adapters/S3StorageAdapter';

export type WebResourceRefData = {
	filename: string;
	href: string;
	contentType?: string;
	contentDisposition?: string;
	size?: number;
};

export type WebResourceSource = {
	filename: string;
	data: Buffer;
	contentType?: string;
	contentDisposition?: string;
	size?: number;
};

export const types = {
	postgres: 'JSONB',
	mysql: 'JSON',
	websql: 'TEXT',
	odata: {
		name: 'Self.WebResource',
		complexType: `\
<ComplexType Name="WebResource">
	<Property Name="filename" Nullable="false" Type="Edm.String"/>\
	<Property Name="href" Nullable="false" Type="Edm.String"/>\
	<Property Name="contentType" Nullable="true" Type="Edm.String"/>\
	<Property Name="contentDisposition" Nullable="true" Type="Edm.String"/>\
	<Property Name="size" Nullable="true" Type="Edm.Int64"/>\
</ComplexType>`,
	},
};

process.env.S3_ENDPOINT = 'http://localhost:43680';
process.env.S3_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
process.env.S3_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
const adapter = new S3StorageAdapter();

export const fetchProcessing = (data: string) => {
	const refData: WebResourceRefData = JSON.parse(data);
	return {
		filename: refData.filename,
		href: refData.href,
		contentType: refData.contentType,
		contentDisposition: refData.contentDisposition,
		size: refData.size,
	};
};

export const validate = TypeUtils.validate.checkRequired(
	async (value: WebResourceSource) => {
		if (!_.isObject(value)) {
			throw new Error('received value is not an object');
		}
		if (!_.has(value, 'filename')) {
			throw new Error('filename is required');
		}
		if (!_.has(value, 'data')) {
			throw new Error('data is required');
		}

		// FIXME call the adapter based on parameters
		const webresource = await adapter.saveFile(value.filename, value.data);

		const refData: WebResourceRefData = {
			filename: value.filename,
			href: webresource.href,
			contentType: value.contentType,
			contentDisposition: value.contentDisposition,
			size: value.size,
		};
		const processedValue = JSON.stringify(refData);
		return processedValue;
	},
);
