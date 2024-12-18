export const findAvailableTable = (tables: Array<boolean>): number => {
	return tables.findIndex((a) => a) ?? -1;
};
