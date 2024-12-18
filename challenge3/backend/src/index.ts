import { serve } from "@hono/node-server";
import { buildEmployeesHandlers } from "./services/employeesHandlers.ts";
import { buildEmployeesRepository } from "./services/employeesRepository.ts";
import { buildEmployeesService } from "./services/employeesService.ts";
import "dotenv/config";
import { Hono } from "hono";

const app = new Hono();

app.route(
	"/",
	buildEmployeesHandlers(buildEmployeesService(buildEmployeesRepository())),
);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
