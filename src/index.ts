declare global {
	interface SBVRType<I,O> {
		types: ConcreteTypes;
	
		validate(value: any, required: boolean, cb: Callback<I>): void;
	
		fetchProcessing?(data: I, cb: Callback<O>): void;
	
		nativeProperties?: NativeProperties;
	
		nativeFactTypes?: NativeFactTypes;
	
		compare?(data: O, encrypted: I): PromiseLike<boolean>;
	}

	type Callback<T> = (err?: any, data?: T) => void;
	type Delayed<T> = (result: T, done: Function) => void;

	type MbDelayed<T> = Delayed<T> | T | Error;

	interface ConcreteTypes {
		postgres: DBTypeBuilder;
		mysql: DBTypeBuilder;
		websql: DBTypeBuilder;
		odata: ODataTypeBuilder;
	}
	
	type DBTypeBuilder =
	string
	| ((necessity: string, index: string) => string);
	
	interface ODataTypeBuilder {
		name: string;
		complexType?: string;
	}

	type InternalDate = Date | string | number | null;
	type NullableDate = Date | null;

	interface RGBA {
		r: number;
		g: number;
		b: number;
		a: number;
	}
}

import { SBVRBoolean }         from './types/Boolean';
import { BigInteger }          from './types/Big Integer';
import { CaseInsensitiveText } from './types/Case Insensitive Text';
import { Color }               from './types/Color';
import { ConceptType }         from './types/ConceptType';
import { SBVRDate }            from './types/Date';
import { DateTime }            from './types/DateTime';
import { File }                from './types/File';
import { ForeignKey }          from './types/ForeignKey';
import { Hashed }              from './types/Hashed';
import { Integer }             from './types/Integer';
import { Interval }            from './types/Interval';
import { SBVRJSON }            from './types/JSON';
import { Real }                from './types/Real';
import { Serial }              from './types/Serial';
import { SHA }                 from './types/SHA';
import { ShortText }           from './types/Short Text';
import { Text }                from './types/Text';
import { Time }                from './types/Time';

export default {
	'Boolean': SBVRBoolean,
	'Big Integer': BigInteger,
	'Case Insensitive Text': CaseInsensitiveText,
	'Color': Color,
	'ConceptType': ConceptType,
	'Date': SBVRDate,
	'Date Time': DateTime,
	'File': File,
	'ForeignKey': ForeignKey,
	'Hashed': Hashed,
	'Integer': Integer,
	'Interval': Interval,
	'JSON': SBVRJSON,
	'Real': Real,
	'Serial': Serial,
	'SHA': SHA,
	'Short Text': ShortText,
	'Text': Text,
	'Time': Time,
};
