import { describe, expect, it } from "vitest";

import { findAvailableTable } from "./b-async.ts";

describe("findAvailableTable", () => {
	describe("when tables only contains false", () => {
		it("should return -1", async () => {
			const tables = [false, false, false];

			expect(await findAvailableTable(tables)).toEqual(-1);
		});
	});

	describe("when tables is [true, false, false]", () => {
		it("should return 0", async () => {
			const tables = [true, false, false];

			expect(await findAvailableTable(tables)).toEqual(0);
		});
	});

	describe("when tables is [false, true, false]", () => {
		it("should return 1", async () => {
			const tables = [false, true, false];

			expect(await findAvailableTable(tables)).toEqual(1);
		});
	});

	describe("when tables is [false, false, true]", () => {
		it("should return 2", async () => {
			const tables = [false, false, true];

			expect(await findAvailableTable(tables)).toEqual(2);
		});
	});

	describe("when tables is [true, false, true]", () => {
		it("should return 0", async () => {
			const tables = [true, false, true];

			expect(await findAvailableTable(tables)).toEqual(0);
		});
	});
});
