import { pgPool } from "../db.ts";
import type { Repository } from "./employeesService.ts";

export const buildEmployeesRepository = (): Repository => {
	return {
		createEmployee,
		listAllEmployees,
		createVacation,
		getEmployee,
	};
};

const createEmployee = async ({
	firstname,
	lastname,
}: { firstname: string; lastname: string }): Promise<{ id: string }> => {
	const result = await pgPool.query(
		`
      INSERT INTO employees (firstname, lastname)
      VALUES ($1, $2)
      RETURNING id
    `,
		[firstname, lastname],
	);

	return result.rows[0];
};

const listAllEmployees = async (): Promise<
	Array<{
		id: string;
		firstname: string;
		lastname: string;
		onLeave: boolean;
	}>
> => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	const currentDate = `${year}-${month}-${day}`;

	const result = await pgPool.query(
		`
      SELECT
        e.id,
        e.firstname,
        e.lastname,
        bool_or(v.id IS NOT NULL) AS "onLeave"
      FROM employees AS e
      LEFT JOIN
      	vacations AS v
      	ON v.employee_id = e.id
      	AND v.start_date <= $1
      	AND v.end_date >= $1
      GROUP BY e.id
      ORDER BY e.lastname;
    `,
		[currentDate],
	);

	return result.rows;
};

const createVacation = async ({
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
	const result = await pgPool.query(
		`
      INSERT INTO vacations (employee_id, start_date, end_date, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
		[employeeId, startDate.toISOString(), endDate.toISOString(), comment],
	);

	return result.rows[0];
};

const getEmployee = async ({
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
	const result = await pgPool.query(
		`
      SELECT
        e.id,
        e.firstname,
        e.lastname,
        COALESCE(
          json_agg(
            json_build_object(
              'id', v.id,
              'startDate', v.start_date,
              'endDate', v.end_date,
              'comment', v.comment
            )
            ORDER BY v.start_date ASC, v.end_date ASC
          ) FILTER (WHERE v.id IS NOT NULL), '[]'
        ) AS vacations
      FROM employees AS e
      LEFT JOIN vacations AS v ON e.id = v.employee_id
      WHERE e.id = $1
      GROUP BY e.id
    `,
		[id],
	);

	const employee = result.rows[0];

	return {
		id: employee.id,
		firstname: employee.firstname,
		lastname: employee.lastname,
		vacations: employee.vacations,
	};
};
