interface SBVRType<I,O> {
  types: ConcreteTypes;

  validate(value: any, required: boolean, cb:Callback<I>): void;

  fetchProcessing?(data:I, cb:Callback<O>): void;

  nativeProperties?: NativeProperties;

  nativeFactTypes?: NativeFactTypes;
}

type Callback<T> = (err?: any, data?: T) => void

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

type InternalDate = Date | null | string | number
type NullableDate = Date | null