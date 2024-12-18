import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

import styles from "./create-employee.lazy.module.css";

export const Route = createLazyFileRoute("/create-employee")({
	component: RouteComponent,
});

function RouteComponent() {
	const [firstname, setFirstname] = React.useState("");
	const [lastname, setLastname] = React.useState("");
	const [error, setError] = React.useState(false);
	const navigate = useNavigate();

	return (
		<div>
			<h2>Create a new employee</h2>
			<form
				className={styles.form}
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					fetch("/api/v1/employees", {
						method: "POST",
						body: JSON.stringify({ firstname, lastname }),
					})
						.then(async (res) => {
							if (res.status === 201) {
								const { id } = await res.json();
								navigate({
									to: "/employee/$employeeId",
									params: { employeeId: id },
								});
							} else {
								setError(true);
							}
						})
						.catch((err) => {
							console.error(err);
							setError(true);
						});
				}}
			>
				<input
					type="text"
					value={firstname}
					onChange={(event) => setFirstname(event.target.value)}
					placeholder="Firstname"
					required={true}
				/>
				<input
					type="text"
					value={lastname}
					onChange={(event) => setLastname(event.target.value)}
					placeholder="Lastname"
					required={true}
				/>
				<input type="submit" value="Create" />
			</form>
			{error && (
				<div className={styles.errorCard}>
					Please try again later or contact support if the problem persists.
				</div>
			)}
		</div>
	);
}
