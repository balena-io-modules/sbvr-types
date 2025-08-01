import * as TypeUtils from '../type-utils';
import type {
	CastNode,
	ExtractJSONPathAsTextNode,
} from '@balena/abstract-sql-compiler' with { 'resolution-mode': 'import' };

export type WebResource = {
	filename: string;
	href: string;
	content_type?: string;
	content_disposition?: string;
	size?: number;
	checksum?: string;
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
	<Property Name="content_type" Nullable="true" Type="Edm.String"/>\
	<Property Name="content_disposition" Nullable="true" Type="Edm.String"/>\
	<Property Name="size" Nullable="true" Type="Edm.Int64"/>\
	<Property Name="checksum" Nullable="true" Type="Edm.String"/>\
</ComplexType>`,
	},
};

export type Types = TypeUtils.TsTypes<WebResource, WebResource | File>;
type DbWriteType = string;

export const nativeProperties: TypeUtils.NativeProperties = {
	has: {
		Filename: (referencedField): ExtractJSONPathAsTextNode => [
			'ExtractJSONPathAsText',
			referencedField,
			['TextArray', ['EmbeddedText', 'filename']],
		],
		HRef: (referencedField): ExtractJSONPathAsTextNode => [
			'ExtractJSONPathAsText',
			referencedField,
			['TextArray', ['EmbeddedText', 'href']],
		],
		'Content Type': (referencedField): ExtractJSONPathAsTextNode => [
			'ExtractJSONPathAsText',
			referencedField,
			['TextArray', ['EmbeddedText', 'content_type']],
		],
		'Content Disposition': (referencedField): ExtractJSONPathAsTextNode => [
			'ExtractJSONPathAsText',
			referencedField,
			['TextArray', ['EmbeddedText', 'content_disposition']],
		],
		Checksum: (referencedField): ExtractJSONPathAsTextNode => [
			'ExtractJSONPathAsText',
			referencedField,
			['TextArray', ['EmbeddedText', 'checksum']],
		],
		Size: (referencedField): CastNode => [
			'Cast',
			[
				'ExtractJSONPathAsText',
				referencedField,
				['TextArray', ['EmbeddedText', 'size']],
			],
			'Big Integer',
		],
	},
};

/**
 * Converts the data, which comes from the DB as a string or object depending on the
 * column type, to a WebResource object
 *
 * @param data string|object
 * @returns a WebResource parsed from the DB
 */
export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	let refData: WebResource;
	if (data === null) {
		return data;
	}
	if (typeof data === 'string') {
		try {
			refData = JSON.parse(data);
		} catch {
			throw new Error(`Invalid JSON: ${data}`);
		}
	} else if (typeof data === 'object') {
		refData = data as WebResource;
	} else {
		throw new Error(`can't be read from stored value ${typeof data}`);
	}

	return {
		filename: refData.filename,
		href: refData.href,
		content_type: refData.content_type,
		content_disposition: refData.content_disposition,
		size: refData.size,
		checksum: refData.checksum,
	};
};

/**
 * Validates the value content.
 *
 * Returns a Stringified WebResource that will be persisted on the DB
 *
 */
export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired((value: WebResource) => {
		if (typeof value !== 'object') {
			throw new Error(`is not an object: ${typeof value}`);
		}
		if (value.filename == null) {
			throw new Error('filename is required and must be a string');
		}
		if (typeof value.filename !== 'string') {
			throw new Error('filename must be a string');
		}
		if (value.href == null) {
			throw new Error('href is required and must be a string');
		}
		if (typeof value.href !== 'string') {
			throw new Error('href must be a string');
		}
		if (value.content_type != null && typeof value.content_type !== 'string') {
			throw new Error('content_type must be a string or undefined');
		}
		if (
			value.content_disposition != null &&
			typeof value.content_disposition !== 'string'
		) {
			throw new Error('content_disposition must be a string or undefined');
		}
		if (value.size != null && !Number.isInteger(value.size)) {
			throw new Error('size must be an integer or undefined');
		}
		if (value.checksum != null && typeof value.checksum !== 'string') {
			throw new Error('checksum must be a string or undefined');
		}
		try {
			return JSON.stringify(value);
		} catch {
			throw new Error("can't stringify JSON content");
		}
	});
