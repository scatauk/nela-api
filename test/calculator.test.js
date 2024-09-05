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
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    const result = calculateNelaRisk(input);
    expect(result).toMatchObject({
      predictedRisk: expect.any(Number),
      debug: expect.any(Object),
    });
  });
  // age, heartRate, systolicBloodPressure, urea, whiteBloodCellCount, albumin, asaGrade, glasgowComaScore, malignancy, dyspnoea, urgency, indicationForSurgery, soiling
  test("invalid age type throws an error", () => {
    const input = {
      age: "65",
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for age");
  });
  test("invalid heartRate type throws an error", () => {
    const input = {
      age: 65,
      heartRate: "80",
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for heartRate");
  });
  test("invalid systolicBloodPressure type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: "120",
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for systolicBloodPressure");
  });
  test("invalid urea type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: "5",
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for urea");
  });
  test("invalid whiteBloodCellCount type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: "10.4",
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for whiteBloodCellCount");
  });
  test("invalid albumin type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: "30",
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for albumin");
  });
  test("invalid asaGrade type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: "2",
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for asaGrade");
  });
  test("invalid gcs type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: "alert",
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for glasgowComaScore");
  });
  test("invalid malignancy type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: 3,
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for malignancy");
  });
  test("invalid dyspnoea type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: "3",
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError(
      "Input type mismatch for dyspnoea (it is 'string' but should be 'integer')",
    );
  });
  test("invalid urgency type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: 2,
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for urgency");
  });
  test("invalid indicationForSurgery type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: 3,
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for indicationForSurgery");
  });
  test("invalid soiling type throws an error", () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: 1,
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input type mismatch for soiling");
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
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
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
      malignancy: "nodal",
      dyspnoea: 0,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
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
      dyspnoea: 3,
      urgency: "2-6hrs",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    const result = calculateNelaRisk(input);
    expect(result.predictedRisk).toBe(22.15);
  });
  test("invalid input throws an error", () => {
    expect(() => calculateNelaRisk(null)).toThrowError();
  });
});
