import { useQuery } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import React from "react";
import styles from "./index.lazy.module.css";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const { isPending, error, data } = useQuery({
		queryKey: ["employees"],
		queryFn: async () => fetch("/api/v1/employees").then((res) => res.json()),
	});
	const [onlyOffEmployees, setOnlyOffEmployees] = React.useState(false);

	if (isPending) return "Loading...";

	if (error) return "An error has occurred";

	return (
		<div>
			<Link to="/create-employee">Create employee</Link>
			<h2>List of all employees</h2>
			<OnlyOffEmployeesCheckboxComponent
				onlyOffEmployees={onlyOffEmployees}
				setOnlyOffEmployees={setOnlyOffEmployees}
			/>
			<AllEmployeesComponent
				employees={data}
				onlyOffEmployees={onlyOffEmployees}
			/>
		</div>
	);
}

function OnlyOffEmployeesCheckboxComponent({
	onlyOffEmployees,
	setOnlyOffEmployees,
}: {
	onlyOffEmployees: boolean;
	setOnlyOffEmployees: (a: (a: boolean) => boolean) => void;
}) {
	return (
		<label
			className={`${styles.checkbox} ${onlyOffEmployees ? styles.checkboxChecked : ""}`}
		>
			<input
				type="checkbox"
				name="checkbox"
				checked={onlyOffEmployees}
				onChange={() => {
					setOnlyOffEmployees((a) => !a);
				}}
			/>
			Show only off employees
		</label>
	);
}

type Employee = {
	id: string;
	firstname: string;
	lastname: string;
	onLeave: boolean;
};

function AllEmployeesComponent({
	employees,
	onlyOffEmployees,
}: {
	employees: Array<Employee>;
	onlyOffEmployees: boolean;
}) {
	const filteredEmployees = React.useMemo(() => {
		if (onlyOffEmployees) {
			return employees.filter((e) => e.onLeave);
		}

		return employees;
	}, [employees, onlyOffEmployees]);

	return (
		<div className={styles.employeesTable}>
			<div className={styles.employeesTableHeader}>Firstname</div>
			<div className={styles.employeesTableHeader}>Lastname</div>
			<div className={styles.employeesTableHeader}>On Leave 🏖️ / 💼</div>
			<div />
			{filteredEmployees.map((employee) => {
				return <EmployeeComponent key={employee.id} employee={employee} />;
			})}
			{filteredEmployees.length === 0 && (
				<>
					<div>There is no employees.</div>
					<div />
					<div />
					<div />
				</>
			)}
		</div>
	);
}

function EmployeeComponent({
	employee,
}: {
	employee: Employee;
}) {
	return (
		<>
			<div>{employee.firstname}</div>
			<div>{employee.lastname}</div>
			<div>{employee.onLeave ? "🏖️" : "💼"}</div>
			<div>
				<Link to="/employee/$employeeId" params={{ employeeId: employee.id }}>
					Show details
				</Link>
			</div>
		</>
	);
}
