interface SBVRType<I,O> {
  types: ConcreteTypes;

  validate(value: any, required: boolean, cb: Callback<I>): void;

  fetchProcessing?(data: I, cb: Callback<O>): void;

  nativeProperties?: NativeProperties;

  nativeFactTypes?: NativeFactTypes;

  compare?(data: O, encrypted: I): PromiseLike<boolean>;
}

interface SBVRTypeTest<I,O> {
  type: SBVRType<I,O>;

  validate(value: any, required: boolean, result: MbDelayed<I>): void;

  fetch(data: I, result: MbDelayed<O>): void;

  types: any
}

type Callback<T> = (err?: any, data?: T) => void
type Delayed<T> = (result: T, done: Function) => void

type MbDelayed<T> = Delayed<T> | T | Error

declare interface ConcreteTypes {
  postgres: DBTypeBuilder;
  mysql: DBTypeBuilder;
  websql: DBTypeBuilder;
  odata: ODataTypeBuilder;
}

type DBTypeBuilder =
    string
  | ((necessity: string, index: string) => string)

declare interface ODataTypeBuilder {
  name: string;
  complexType?: string;
}

//TODO: Change this once we define the AbstractSQL type
type AbstractSQL = any[]

declare interface NativeProperties {
  [verb: string]: {
    [term: string]: (from: string) => AbstractSQL;
  }
}

declare interface NativeFactTypes {
  [term: string]: {
    [verb: string]: (from: string, to: string) => AbstractSQL;
  }
}

type InternalDate = Date | string | number | null
type NullableDate = Date | null

interface RGBA {
	r: number
	g: number
	b: number
	a: number
}

// For tests
declare module 'aws-sdk-mock';