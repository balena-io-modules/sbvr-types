import type { SbvrType } from './type-utils';
export type { SbvrType };

import * as BigInteger from './types/big-integer';
import * as BigSerial from './types/big-serial';
// eslint-disable-next-line id-denylist
import * as Boolean from './types/boolean';
import * as CaseInsensitiveText from './types/case-insensitive-text';
import * as Color from './types/color';
import * as ConceptType from './types/concept-type';
import * as Date from './types/date';
import * as DateTime from './types/date-time';
import * as File from './types/file';
import * as ForeignKey from './types/foreign-key';
import * as Hashed from './types/hashed';
import * as Integer from './types/integer';
import * as Interval from './types/interval';
import * as JSON from './types/json';
import * as Real from './types/real';
import * as Serial from './types/serial';
import * as SHA from './types/sha';
import * as ShortText from './types/short-text';
import * as Text from './types/text';
import * as Time from './types/time';
import * as WebResource from './types/web-resource';

export { WebResource as WebResourceType } from './types/web-resource';

export default {
	'Big Integer': BigInteger,
	'Big Serial': BigSerial,
	// eslint-disable-next-line id-denylist
	Boolean,
	'Case Insensitive Text': CaseInsensitiveText,
	Color,
	ConceptType,
	'Date Time': DateTime,
	Date,
	File,
	ForeignKey,
	Hashed,
	Integer,
	Interval,
	JSON,
	Real,
	Serial,
	SHA,
	'Short Text': ShortText,
	Text,
	Time,
	WebResource,
} satisfies {
	Hashed: SbvrType & {
		compare: (str: string, hash: string) => Promise<boolean>;
	};
	SHA: SbvrType & {
		validateSync: (value: string) => string;
		compare: (str: string, hash: string) => Promise<boolean>;
	};
	[fieldType: string]: SbvrType;
};
