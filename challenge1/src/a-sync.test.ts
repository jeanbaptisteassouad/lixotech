import { describe, expect, it } from "vitest";

import { findAvailableTable } from "./a-sync.ts";

describe("findAvailableTable", () => {
	describe("when tables only contains false", () => {
		it("should return -1", () => {
			const tables = [false, false, false];

			expect(findAvailableTable(tables)).toEqual(-1);
		});
	});

	describe("when tables is [true, false, false]", () => {
		it("should return 0", () => {
			const tables = [true, false, false];

			expect(findAvailableTable(tables)).toEqual(0);
		});
	});

	describe("when tables is [false, true, false]", () => {
		it("should return 1", () => {
			const tables = [false, true, false];

			expect(findAvailableTable(tables)).toEqual(1);
		});
	});

	describe("when tables is [false, false, true]", () => {
		it("should return 2", () => {
			const tables = [false, false, true];

			expect(findAvailableTable(tables)).toEqual(2);
		});
	});

	describe("when tables is [true, false, true]", () => {
		it("should return 0", () => {
			const tables = [true, false, true];

			expect(findAvailableTable(tables)).toEqual(0);
		});
	});
});
