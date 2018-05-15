//TODO: Change this once we define the AbstractSQL type
type AbstractSQL = any[];

declare interface NativeProperties {
	[verb: string]: {
		[term: string]: (from: string) => AbstractSQL;
	};
}

declare interface NativeFactTypes {
	[term: string]: {
		[verb: string]: (from: string, to: string) => AbstractSQL;
	};
}
