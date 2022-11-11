export interface WebResource {
	filename: string;
	href: string;
	engine: string;
}

export abstract class StorageAdapter {
	abstract saveFile(filename: string, data: Buffer): Promise<WebResource>;
	abstract getFileData(webresource: WebResource): Promise<Buffer>;
	abstract deleteFile(webresource: WebResource): Promise<void>;
}
