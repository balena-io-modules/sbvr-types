import * as TypeUtils from '../type-utils';

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

type WebResourceData = {
	filename: string;
	href: string;
	contentType: string;
	contentDisposition: string;
	size: number;
};

export const fetchProcessing = (data: string) => {
	const sourceObj: WebResourceData = JSON.parse(data);
	return {
		filename: sourceObj.filename,
		href: sourceObj.href,
		contentType: sourceObj.contentType,
		contentDisposition: sourceObj.contentDisposition,
		size: sourceObj.size,
	};
};

export const validate = TypeUtils.validate.checkRequired((value: any) => {
	return value;
});
