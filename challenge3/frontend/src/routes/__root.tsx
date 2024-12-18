import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import styles from "./__root.module.css";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className={styles.container}>
				<Link className={styles.home} to="/">
					Leave Management System
				</Link>{" "}
				<div>
					<Outlet />
				</div>
			</div>
		</>
	),
});
