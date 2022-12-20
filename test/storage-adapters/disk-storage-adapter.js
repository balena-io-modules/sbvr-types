import * as os from 'os';
import * as path from 'path';
import * as fsBase from 'fs';
const fs = fsBase.promises;

export const DISK_STORAGE_ADAPTER_NAME = 'DISK';

const BASE_DIR = os.tmpdir();

export const DiskStorageAdapter =
	// StorageAdapter
	{
		name: DISK_STORAGE_ADAPTER_NAME,

		async saveFile(filename, data) {
			// : Promise<FileRef>
			const filePath = path.join(BASE_DIR, filename);
			await fs.writeFile(filePath, data);

			const webresource = {
				storage: DISK_STORAGE_ADAPTER_NAME,
				filename,
				href: filePath,
			};
			return webresource;
		},

		async getFileData(webresource) {
			const file = await fs.readFile(webresource.href);
			return file;
		},

		async deleteFile(webresource) {
			await fs.unlink(webresource.href);
		},
	};
