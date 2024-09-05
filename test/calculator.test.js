// sum.test.js
import { describe, expect, test } from "vitest";
import { calculateNelaRisk } from "../src/index.js";

describe("calculateNelaRisk function", () => {
  test("call with with valid input returns an object with predictedRisk and debug keys", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: 0,
      dyspnoea: 0,
      urgency: 1,
      indicationForSurgery: 1,
      soiling: 0,
    };
    const result = calculateNelaRisk(input);
    expect(result).toMatchObject({
      predictedRisk: expect.any(Number),
      debug: expect.any(Object),
    });
  });
  // check predictRisk is between 0 and 100
  test("predictedRisk is between 0 and 100", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: 0,
      dyspnoea: 0,
      urgency: 1,
      indicationForSurgery: 1,
      soiling: 0,
    };
    const result = calculateNelaRisk(input);
    expect(result.predictedRisk).toBeGreaterThanOrEqual(0);
    expect(result.predictedRisk).toBeLessThanOrEqual(100);
  });
  // check predictRisk is not NaN
  test("predictedRisk is not NaN", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: 0,
      dyspnoea: 0,
      urgency: 1,
      indicationForSurgery: 1,
      soiling: 0,
    };
    const result = calculateNelaRisk(input);
    expect(result.predictedRisk).not.toBeNaN();
  });
  // for test vectors, check predictedRisk is correct
  test("predictedRisk is correct for test vectors", () => {
    const input = {
      age: 65,
      heartRate: 85,
      systolicBloodPressure: 130,
      urea: 7,
      whiteBloodCellCount: 12,
      albumin: 30,
      asaGrade: 3,
      glasgowComaScore: 14,
      malignancy: "nodal",
      dyspnoea: "3",
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    const result = calculateNelaRisk(input);
    expect(result.predictedRisk).toBe(22.15);
  });
  test("calculateNelaRisk function with invalid input throws an error", () => {
    expect(() => calculateNelaRisk(null)).toThrowError(
      "Error calculating NELA risk: TypeError: Cannot read properties of null (reading 'age')",
    );
  });
});

