import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TIME',
	mysql: 'TIME',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

type ReadType = string;
type WriteType = number | string;
type DbWriteType = string;

export const fetchProcessing: TypeUtils.FetchProcessing<ReadType> = (data) => {
	if (data != null) {
		// We append the date of the epoch so that we can parse this as a valid date.
		return new Date('Thu, 01 Jan 1970 ' + data).toISOString();
	}
	return data;
};

export const validate: TypeUtils.Validate<WriteType, DbWriteType> = (async (
	value,
	required,
) => {
	const date = await TypeUtils.validate.date(value, required);
	if (date == null) {
		return date;
	}
	return date.toLocaleTimeString();
}) as {
	(value: WriteType, required: true): Promise<DbWriteType>;
	(value: WriteType, required: false): Promise<DbWriteType | null>;
	(value: WriteType, required: boolean): Promise<DbWriteType | null>;
};
