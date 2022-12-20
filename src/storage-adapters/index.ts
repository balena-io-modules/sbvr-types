import { StorageAdapter, StorageRegistry } from './types';

export * from './types';
const storageRegistry: StorageRegistry = {};

export function registerStorageAdapter(
	name: string,
	adapter: StorageAdapter,
): void {
	storageRegistry[name] = adapter;
}

export function getStorageAdapter(name: string): StorageAdapter {
	return storageRegistry[name];
}

export function unregisterStorageAdapter(name: string): void {
	delete storageRegistry[name];
}

export function getStorageAdapterNames(): string[] {
	return Object.keys(storageRegistry);
}
