import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";
import styles from "./employee.$employeeId.lazy.module.css";

export const Route = createLazyFileRoute("/employee/$employeeId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { employeeId } = Route.useParams();

	const { isPending, error, data } = useQuery({
		queryKey: ["employees", employeeId],
		queryFn: async () =>
			fetch(`/api/v1/employees/${employeeId}`).then((res) => res.json()),
	});

	if (isPending) return "Loading...";

	if (error) return "An error has occurred";

	return (
		<div>
			<FullnameComponent firstname={data.firstname} lastname={data.lastname} />
			<CreateLeaveFormComponent employeeId={employeeId} />
			<AllVacationsComponent vacations={data.vacations} />
		</div>
	);
}

function FullnameComponent({
	firstname,
	lastname,
}: {
	firstname: string;
	lastname: string;
}) {
	return <h1>{`${firstname} ${lastname}`}</h1>;
}

function CreateLeaveFormComponent({ employeeId }: { employeeId: string }) {
	const [startDate, setStartDate] = React.useState("");
	const [endDate, setEndDate] = React.useState("");
	const [comment, setComment] = React.useState("");
	const [error, setError] = React.useState(false);
	const queryClient = useQueryClient();

	return (
		<>
			<h2>Create new vacation</h2>
			<form
				className={styles.form}
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					fetch(`/api/v1/employees/${employeeId}/vacations`, {
						method: "POST",
						body: JSON.stringify({ startDate, endDate, comment }),
					})
						.then(async (res) => {
							if (res.status === 201) {
								setStartDate("");
								setEndDate("");
								setComment("");
								setError(false);
								queryClient.invalidateQueries({
									queryKey: ["employees", employeeId],
								});
							} else {
								setError(true);
							}
						})
						.catch((err) => {
							setError(true);
							console.error(err);
						});
				}}
			>
				<label htmlFor="startDate">Start date</label>
				<input
					type="date"
					name="startDate"
					value={startDate}
					onChange={(event) => setStartDate(event.target.value)}
					required={true}
				/>
				<label htmlFor="endDate">End date</label>
				<input
					type="date"
					name="endDate"
					value={endDate}
					onChange={(event) => setEndDate(event.target.value)}
					required={true}
				/>

				<textarea
					placeholder="Your comment here..."
					style={{ width: "100%" }}
					value={comment}
					onChange={(event) => setComment(event.target.value)}
				/>
				<input type="submit" value="Create" />
			</form>
			{error && (
				<div className={styles.errorCard}>
					Please ensure the start date is before the end date. Try again later
					or contact support if the problem persists.
				</div>
			)}
		</>
	);
}

type Vacation = {
	id: string;
	startDate: string;
	endDate: string;
	comment: string;
};

function AllVacationsComponent({ vacations }: { vacations: Array<Vacation> }) {
	return (
		<>
			<h2>All vacations</h2>
			<div className={styles.vacations}>
				<div className={styles.vacationsHeader}>Start date</div>
				<div className={styles.vacationsHeader}>End date</div>
				<div className={styles.vacationsHeader}>Comment</div>
				{vacations.map((vacation) => {
					return <VacationComponent key={vacation.id} vacation={vacation} />;
				})}
				{vacations.length === 0 && (
					<>
						<div>There is no vacations.</div>
						<div />
						<div />
					</>
				)}
			</div>
		</>
	);
}

function VacationComponent({ vacation }: { vacation: Vacation }) {
	return (
		<>
			<div>{vacation.startDate}</div>
			<div>{vacation.endDate}</div>
			<div>{vacation.comment}</div>
		</>
	);
}
