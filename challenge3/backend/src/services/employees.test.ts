import { describe, expect, it } from "vitest";
import { buildEmployeesHandlers } from "./employeesHandlers.ts";
import { buildEmployeesRepository } from "./employeesRepository.ts";
import { buildEmployeesService } from "./employeesService.ts";
import "dotenv/config";

// This is the first version of the employees service tests.
// In the future, we should parameterize the repository to
// use a disposable PostgreSQL database for testing purposes.
// This file demonstrates the backend's testing capabilities.

const app = buildEmployeesHandlers(
	buildEmployeesService(buildEmployeesRepository()),
);

describe("POST /api/v1/employees", () => {
	it("should returned an id", async () => {
		const res = await app.request("/api/v1/employees", {
			method: "POST",
			body: JSON.stringify({
				firstname: "baba",
				lastname: "is_you",
			}),
		});
		expect(res.status).toBe(201);
		expect(typeof (await res.json()).id).toBe("string");
	});
});

describe("GET /api/v1/employees/$id", async () => {
	const res = await app.request("/api/v1/employees", {
		method: "POST",
		body: JSON.stringify({
			firstname: "baba",
			lastname: "is_you",
		}),
	});
	const id = (await res.json()).id;

	it("should returned valid id", async () => {
		const res = await app.request(`/api/v1/employees/${id}`);

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.id).toBe(id);
	});

	it("should returned valid firstname", async () => {
		const res = await app.request(`/api/v1/employees/${id}`);

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.firstname).toBe("baba");
	});

	it("should returned valid lastname", async () => {
		const res = await app.request(`/api/v1/employees/${id}`);

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.lastname).toBe("is_you");
	});
});

describe("POST /api/v1/employees/$id", async () => {
	const res1 = await app.request("/api/v1/employees", {
		method: "POST",
		body: JSON.stringify({
			firstname: "baba",
			lastname: "is_you",
		}),
	});
	const employeeId = (await res1.json()).id;

	it("should returned valid vacation", async () => {
		const res2 = await app.request(
			`/api/v1/employees/${employeeId}/vacations`,
			{
				method: "POST",
				body: JSON.stringify({
					employeeId,
					startDate: "2020-01-01",
					endDate: "2020-02-01",
					comment: "My comment",
				}),
			},
		);

		expect(res2.status).toBe(201);
		const vacationId = (await res2.json()).id;

		const res = await app.request(`/api/v1/employees/${employeeId}`);

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.vacations.length).toBe(1);
		expect(body.vacations[0]).toStrictEqual({
			id: vacationId,
			startDate: "2020-01-01",
			endDate: "2020-02-01",
			comment: "My comment",
		});
	});
});
