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
		// We append the date of the epoch so that we can parse this as a valid date,
		// and parse it as UTC as that is how `validate` stores it.
		return new Date(`Thu, 01 Jan 1970 ${data} GMT`).toISOString();
	}
	return data;
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.checkRequired(async (value) => {
		const date = await TypeUtils.validate.date(value, true);
		// We store the UTC time as `HH:MM:SS.sss`, which unlike the locale format is the same everywhere
		const isoString = date.toISOString();
		return isoString.slice(isoString.indexOf('T') + 1, -1);
	});

export const schema = TypeUtils.schema.date;
