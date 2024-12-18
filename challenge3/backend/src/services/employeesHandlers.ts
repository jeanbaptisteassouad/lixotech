import { Hono } from "hono";
import { z } from "zod";
import type { Service } from "./employeesService.ts";

export const buildEmployeesHandlers = (service: Service) => {
	const router = new Hono();

	const postEmployeesPayload = z.object({
		firstname: z.string(),
		lastname: z.string(),
	});

	router.post("/api/v1/employees", async (c) => {
		const body = await c.req.json();
		const payload = await postEmployeesPayload.parseAsync(body);

		const { id } = await service.createEmployee(payload);

		c.status(201);
		c.header("Location", `/api/v1/employees/${id}`);
		return c.json({
			id,
		});
	});

	router.get("/api/v1/employees", async (c) => {
		return c.json(await service.listAllEmployees());
	});

	const postVacationsPayload = z.object({
		startDate: z.string().date(),
		endDate: z.string().date(),
		comment: z.string(),
	});

	router.post("/api/v1/employees/:id/vacations", async (c) => {
		const { id: employeeId } = c.req.param();
		const body = await c.req.json();
		const payload = await postVacationsPayload.parseAsync(body);

		const { id } = await service.createVacation({
			employeeId,
			startDate: new Date(payload.startDate),
			endDate: new Date(payload.endDate),
			comment: payload.comment,
		});

		c.status(201);
		return c.json({
			id,
		});
	});

	router.get("/api/v1/employees/:id", async (c) => {
		const { id } = c.req.param();

		return c.json(await service.getEmployee({ id }));
	});

	return router;
};
