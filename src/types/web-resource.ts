import * as TypeUtils from '../type-utils';
import { getStorageAdapter } from '../storage-adapters/index';

/**
 * This is how WebResources are stored on the DB
 */
export type WebResourceRef = {
	filename: string;
	href: string;
	contentType?: string;
	contentDisposition?: string;
	size?: number;
};

/**
 * This is how WebResources are defined on creation
 */
export type WebResourceInput = {
	filename: string;
	data: Buffer;
	contentType?: string;
	contentDisposition?: string;
	size?: number;
	storage: string;
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

export const nativeProperties = {
	has: {
		Filename: (from: any) => ['ExtractJSONPathAsText', from, '$.filename'],
		HRef: (from: any) => ['ExtractJSONPathAsText', from, '$.href'],
		'Content Type': (from: any) => [
			'ExtractJSONPathAsText',
			from,
			'$.contentType',
		],
		'Content Disposition': (from: any) => [
			'ExtractJSONPathAsText',
			from,
			'$.contentDisposition',
		],
		Size: (from: any) => ['ExtractJSONPathAsText', from, '$.size'],
	},
};

export const fetchProcessing = (data: any) => {
	let refData: WebResourceRef;
	if (data === null) {
		return data;
	}
	if (typeof data === 'string') {
		try {
			refData = JSON.parse(data);
		} catch (e: any) {
			throw new Error(
				`can't be parsed from stored value ${typeof data} with error ${
					e.message
				}`,
			);
		}
	} else if (typeof data === 'object') {
		refData = data;
	} else {
		throw new Error(`can't be read from stored value ${typeof data}`);
	}

	return {
		filename: refData.filename,
		href: refData.href,
		contentType: refData.contentType,
		contentDisposition: refData.contentDisposition,
		size: refData.size,
	};
};

export const validate = TypeUtils.validate.checkRequired(
	async (value: WebResourceInput) => {
		if (typeof value !== 'object') {
			throw new Error(`is not an object: ${typeof value}`);
		}
		if (!value.filename) {
			throw new Error('filename is required');
		}
		if (!value.data) {
			throw new Error('data is required');
		}

		const storage = value.storage;
		if (!storage) {
			throw new Error('storage is required');
		}
		const storageAdapter = getStorageAdapter(storage);
		if (!storageAdapter) {
			throw new Error(`storage named '${storage}' not defined`);
		}

		let webresource;
		try {
			webresource = await storageAdapter.saveFile(value.filename, value.data);
		} catch (e: any) {
			throw new Error(`can't be saved; error ${e.message}`);
		}

		const refData: WebResourceRef = {
			filename: value.filename,
			href: webresource.href,
			contentType: value.contentType,
			contentDisposition: value.contentDisposition,
			size: value.size,
		};
		try {
			const processedValue = JSON.stringify(refData);
			return processedValue;
		} catch (e: any) {
			throw new Error(`can't be stringified; error ${e.message}`);
		}
	},
);
