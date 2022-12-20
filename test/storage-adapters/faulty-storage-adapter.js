export const FAULTY_STORAGE_ADAPTER_NAME = 'FAULTY';

/**
 * An storage adapter used in tests that throws an Error on all operations
 */
export const FaultyStorageAdapter =
	// StorageAdapter
	{
		name: FAULTY_STORAGE_ADAPTER_NAME,

		async saveFile(filename, data) {
			throw new Error(`Invalid ${filename} of type ${typeof data}`);
		},

		async getFileData(webresource) {
			throw new Error(`Invalid ${webresource}`);
		},

		async deleteFile(webresource) {
			throw new Error(`Invalid ${webresource}`);
		},
	};
