import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import path = require('node:path');

import { StorageAdapter, WebResource } from './StorageAdapter';

const ENGINE_NAME = 'DISK';

const BASE_DIR = os.tmpdir();

export class DiskStorageAdapter extends StorageAdapter {
	async saveFile(filename: string, data: Buffer): Promise<WebResource> {
		const filePath = path.join(BASE_DIR, filename);
		await fs.writeFile(filePath, data);

		const webresource: WebResource = {
			engine: ENGINE_NAME,
			filename,
			href: filePath,
		};

		return webresource;
	}

	async getFileData(webresource: WebResource): Promise<Buffer> {
		const file = await fs.readFile(webresource.href);
		return file;
	}

	async deleteFile(webresource: WebResource): Promise<void> {
		await fs.unlink(webresource.href);
	}
}
