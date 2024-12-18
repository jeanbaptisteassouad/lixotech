import path from "node:path";
import pg from "pg";
import { migrate } from "postgres-migrations";
import "dotenv/config";

(async () => {
	const client = new pg.Client();
	await client.connect();
	try {
		await migrate({ client }, path.join(import.meta.dirname, "../migrations"));
	} finally {
		await client.end();
	}
})();
