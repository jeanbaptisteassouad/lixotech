export type Repository = {
	createEmployee: (a: {
		firstname: string;
		lastname: string;
	}) => Promise<{ id: string }>;

	listAllEmployees: () => Promise<
		Array<{ id: string; firstname: string; lastname: string; onLeave: boolean }>
	>;

	createVacation: (a: {
		employeeId: string;
		startDate: Date;
		endDate: Date;
		comment: string;
	}) => Promise<{ id: string }>;

	getEmployee: (a: {
		id: string;
	}) => Promise<{
		id: string;
		firstname: string;
		lastname: string;
		vacations: Array<{
			id: string;
			startDate: Date;
			endDate: Date;
			comment: string;
		}>;
	}>;
};

export const buildEmployeesService = (repository: Repository) => {
	return {
		createEmployee: createEmployee(repository),
		listAllEmployees: listAllEmployees(repository),
		createVacation: createVacation(repository),
		getEmployee: getEmployee(repository),
	};
};

export type Service = ReturnType<typeof buildEmployeesService>;

const createEmployee =
	(repository: Repository) =>
	async ({
		firstname,
		lastname,
	}: {
		firstname: string;
		lastname: string;
	}): Promise<{ id: string }> => {
		return repository.createEmployee({ firstname, lastname });
	};

const listAllEmployees =
	(repository: Repository) =>
	async (): Promise<
		Array<{
			id: string;
			firstname: string;
			lastname: string;
			onLeave: boolean;
		}>
	> => {
		return repository.listAllEmployees();
	};

const createVacation =
	(repository: Repository) =>
	async ({
		employeeId,
		startDate,
		endDate,
		comment,
	}: {
		employeeId: string;
		startDate: Date;
		endDate: Date;
		comment: string;
	}): Promise<{ id: string }> => {
		return repository.createVacation({
			employeeId,
			startDate,
			endDate,
			comment,
		});
	};

const getEmployee =
	(repository: Repository) =>
	async ({
		id,
	}: {
		id: string;
	}): Promise<{
		id: string;
		firstname: string;
		lastname: string;
		vacations: Array<{
			id: string;
			startDate: Date;
			endDate: Date;
			comment: string;
		}>;
	}> => {
		return repository.getEmployee({ id });
	};
