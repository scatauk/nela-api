import { describe, expect, test } from "vitest";
import { calculateNelaRisk } from "../src/index.js";

function getIndications(fields) {
  const output = {};
  // output.ind_ischaemia = fields[12] === "Indicated";
  output.indNecrosis = fields[35] === "Indicated";
  output.indIschaemia = fields[36] === "Indicated";
  output.indAcidosis = fields[37] === "Indicated";
  output.indColitis = fields[38] === "Indicated";
  // output.ind_sepsis = fields[17] === "Indicated";
  output.indPhlegmon = fields[26] === "Indicated";
  output.indPneumoperitoneum = fields[27] === "Indicated";
  output.indSepsisOther = fields[34] === "Indicated";
  output.indIatrogenicInjury = fields[28] === "Indicated";
  output.indAnastomoticLeak = fields[29] === "Indicated";
  output.indPerforation = fields[30] === "Indicated";
  output.indPeritonitis = fields[31] === "Indicated";
  output.indAbdominalAbscess = fields[32] === "Indicated";
  output.indIntestinalFistula = fields[33] === "Indicated";
  // output.ind_obst = fields[27] === "Indicated";
  output.indTenderSmallBowelObstruction = fields[24] === "Indicated";
  output.indNonTenderSmallBowelObstruction = fields[22] === "Indicated";
  output.indTenderLargeBowelObstruction = fields[23] === "Indicated";
  output.indNonTenderLargeBowelObstruction = fields[21] === "Indicated";
  output.indGastricOutletObstruction = fields[20] === "Indicated";
  output.indIncarceratedHernia = fields[14] === "Indicated";
  output.indHiatusHernia = fields[25] === "Indicated";
  output.indVolvulus = fields[13] === "Indicated";
  output.indInternalHernia = fields[15] === "Indicated";
  output.indObstructingIncisionalHernia = fields[16] === "Indicated";
  output.indIntussusception = fields[17] === "Indicated";
  output.indPseudoObstruction = fields[18] === "Indicated";
  output.indForeignBody = fields[19] === "Indicated";
  // output.ind_bleed = fields[41] === "Indicated";
  output.indHaemorrhage = fields[12] === "Indicated";
  output.indAbdominalWoundDehiscence = fields[39] === "Indicated";
  output.indAbdominalCompartmentSyndrome = fields[40] === "Indicated";
  output.indPlannedRelook = fields[41] === "Indicated";
  output.indOther = fields[42] === "Indicated";
  return output;
}

function maxIndication(input) {
  let maxInd = 0;
  if (input.ind_ischaemia || input.indNecrosis || input.indIschaemia || input.indAcidosis || input.indColitis) {
    maxInd = 3; //Ischaemia
  } else if (
    input.ind_sepsis ||
    input.indPhlegmon ||
    input.indPneumoperitoneum ||
    input.indSepsisOther ||
    input.indIatrogenicInjury ||
    input.indAnastomoticLeak ||
    input.indPerforation ||
    input.indPeritonitis ||
    input.indAbdominalAbscess ||
    input.indIntestinalFistula
  ) {
    maxInd = 2; //Sepsis
  } else if (
    input.ind_obst ||
    input.indTenderSmallBowelObstruction ||
    input.indNonTenderSmallBowelObstruction ||
    input.indTenderLargeBowelObstruction ||
    input.indNonTenderLargeBowelObstruction ||
    input.indGastricOutletObstruction ||
    input.indIncarceratedHernia ||
    input.indHiatusHernia ||
    input.indVolvulus ||
    input.indInternalHernia ||
    input.indObstructingIncisionalHernia ||
    input.indIntussusception ||
    input.indPseudoObstruction ||
    input.indForeignBody
  ) {
    maxInd = 1; //Obstruction
  } else if (input.ind_bleed || input.indHaemorrhage) {
    maxInd = 4; //Bleeding
  } else if (
    input.indAbdominalWoundDehiscence ||
    input.indAbdominalCompartmentSyndrome ||
    input.indPlannedRelook ||
    input.indOther
  ) {
    maxInd = 5; //Other
  }
  switch (maxInd) {
    case 1:
      return "obstruction";
    case 2:
      return "sepsis";
    case 3:
      return "ischaemia";
    case 4:
      return "bleeding";
    case 5:
      return "other";
  }
  return "none";
}

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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    const result = calculateNelaRisk(input);
    expect(result).toMatchObject({
      predictedRisk: expect.any(Number),
      debug: expect.any(Object),
    });
  });
  test("invalid input schema throws an error", () => {
    const input = {
      cows: "milk",
      latest: 80,
      understood: { yes: "no" },
    };
    expect(() => calculateNelaRisk(input)).toThrowError("Input keys do not match schema keys");
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: 3,
      urgency: "BT 2 - 6",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    expect(() => calculateNelaRisk(input)).toThrowError(
      "Input type mismatch for dyspnoea (it is 'number' but should be 'string')",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "No dyspnoea",
      urgency: "BT 2 - 6",
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
      malignancy: "Nodal",
      dyspnoea: "Dyspnoea at rest/rate >30 at rest or CXR: fibrosis or consolidation",
      urgency: "BT 2 - 6",
      indicationForSurgery: "sepsis",
      soiling: true,
    };
    const result = calculateNelaRisk(input);
    expect(result.predictedRisk).toBe(22.151);
  });
  test("invalid input throws an error", () => {
    expect(() => calculateNelaRisk(null)).toThrowError();
  });
});

describe("Test vectors file", () => {
  // load sim.csv
  const fs = require("fs");
  const path = require("path");
  // read whole of sim.csv into variable
  const data = fs.readFileSync(path.resolve(__dirname, "../test/sim.csv"), "utf8");
  // split into lines
  const lines = data.split("\n");
  // for each line, split into fields
  for (let i = 1; i < lines.length; i++) {
    // for (let i = 4175; i < 4176; i++) {
    const fields = lines[i].split(",");
    // for each field, convert to correct type
    const input = {
      age: parseInt(fields[1]),
      heartRate: parseInt(fields[4]),
      systolicBloodPressure: parseInt(fields[5]),
      urea: parseFloat(fields[6]),
      whiteBloodCellCount: parseFloat(fields[7]),
      albumin: parseFloat(fields[3]),
      asaGrade: parseInt(fields[2]),
      glasgowComaScore: parseInt(fields[8]),
      malignancy: fields[9],
      dyspnoea: fields[10],
      urgency: fields[11],
      indicationForSurgery: maxIndication(getIndications(fields)),
      soiling: fields[43] === "Free pus blood or bowel contents",
    };
    // fields[46] is intercept - skip if empty
    if (fields[46] !== "") {
      // check predictedRisk is correct
      test(`predictedRisk is correct for test vector ${i}`, () => {
        const result = calculateNelaRisk(input);
        expect(result.predictedRisk).toBe(parseFloat(fields[78]));
      });
    }
  }
});
