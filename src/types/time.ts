import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'TIME',
	mysql: 'TIME',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.DateTime',
	},
};

export type Types = TypeUtils.TsTypes<string, number | string | Date>;
type DbWriteType = string;

export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data != null) {
		// We append the date of the epoch so that we can parse this as a valid date.
		return new Date(`Thu, 01 Jan 1970 ${data}`).toISOString();
	}
	return data;
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	(async (value, required) => {
		const date = await TypeUtils.validate.date(value, required);
		if (date == null) {
			return date;
		}
		return date.toLocaleTimeString();
	}) as {
		(value: Types['Write'], required: true): Promise<DbWriteType>;
		(value: Types['Write'], required: false): Promise<DbWriteType | null>;
		(value: Types['Write'], required: boolean): Promise<DbWriteType | null>;
	};
