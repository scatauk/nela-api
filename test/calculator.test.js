// sum.test.js
import { expect, test } from "vitest";
import { calculateNelaRisk } from "../src/index.js";

test("calculateNelaRisk function with invalid input throws an error", () => {
  expect(() => calculateNelaRisk(null)).toThrowError(
    "Error calculating NELA risk: TypeError: Cannot read properties of null (reading 'age')",
  );
});
