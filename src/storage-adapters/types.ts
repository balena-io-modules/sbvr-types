export interface FileRef {
	filename: string;
	href: string;
	storage: string;
}

export interface StorageAdapter {
	name: string;
	saveFile(filename: string, data: Buffer): Promise<FileRef>;
	getFileData(fileRef: FileRef): Promise<Buffer>;
	deleteFile(fileRef: FileRef): Promise<void>;
}

export interface StorageRegistry {
	[key: string]: StorageAdapter;
}
