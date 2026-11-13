import * as TypeUtils from '../type-utils';

export const types = {
	postgres: 'INTERVAL',
	mysql: 'INTEGER',
	websql: 'INTEGER',
	odata: {
		name: 'Edm.Int64',
	},
};

export type Types = TypeUtils.TsTypes<number, number>;
type DbWriteType = number;

type PostgresInterval = Partial<
	Record<
		| 'years'
		| 'months'
		| 'days'
		| 'hours'
		| 'minutes'
		| 'seconds'
		| 'milliseconds',
		number
	>
>;
const secondsPerDay = 24 * 60 * 60;

/**
 * The pg module returns an INTERVAL as a `postgres-interval` object, so it's converted to seconds the same way
 * as postgres' `EXTRACT(EPOCH FROM ...)`, with a year as 365.25 days and a month as 30 days.
 *
 * Limitation: postgres-interval parses `infinity`/`-infinity` (Postgres 17+), and intervals output with an
 * `IntervalStyle` other than the default `postgres`, to an empty object, so they read as 0. `validate` only
 * accepts integers, so infinite intervals can only be written with raw SQL.
 */
export const fetchProcessing: TypeUtils.FetchProcessing<Types['Read']> = (
	data,
) => {
	if (data == null || typeof data === 'number') {
		return data;
	}
	if (typeof data !== 'object') {
		throw new Error('Fetched interval is not valid: ' + typeof data);
	}
	const {
		years = 0,
		months = 0,
		days = 0,
		hours = 0,
		minutes = 0,
		seconds = 0,
		milliseconds = 0,
	} = data as PostgresInterval;
	return (
		(years * 365.25 + months * 30 + days) * secondsPerDay +
		hours * 60 * 60 +
		minutes * 60 +
		seconds +
		milliseconds / 1000
	);
};

export const validate: TypeUtils.Validate<Types['Write'], DbWriteType> =
	TypeUtils.validate.integer;

export const schema = TypeUtils.schema.integer;
