import { describe, expect, test, beforeAll, afterAll, vi } from 'vitest';
import { checkSchema } from '../src/checkSchema.js';

describe('checkSchema function', () => {
  test('a valid schema returns { result: true }', () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      malignancy: 'Nodal',
      dyspnoea: 'No dyspnoea',
      urgency: 'BT 2 - 6',
      indicationForSurgery: 'sepsis',
      soiling: true,
    };
    const result = checkSchema(input);
    expect(result).toStrictEqual({ result: true });
  });
  test('a invalid schema returns a failure', () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      dyspnoea: 'No dyspnoea',
      urgency: 'BT 2 - 6',
      indicationForSurgery: 'sepsis',
      soiling: true,
    };
    const result = checkSchema(input);
    expect(result).toStrictEqual({ result: false, error: 'Input keys do not match schema keys' });
  });
  test('Type errors will fail', () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: '15',
      malignancy: 'Nodal',
      dyspnoea: 'No dyspnoea',
      urgency: 'BT 2 - 6',
      indicationForSurgery: 'sepsis',
      soiling: true,
    };
    const result = checkSchema(input);
    expect(result).toStrictEqual({
      result: false,
      error: "Input type mismatch for glasgowComaScore (it is 'string' but should be 'integer')",
    });
  });
});

describe('checkSchema failure check', () => {
  let originalObject;
  beforeAll(() => {
    originalObject = global.Object;
    global.Object.values = vi.fn();
  });
  afterAll(() => {
    global.Object = originalObject;
  });
  test('if check schema fails an error will throw', () => {
    const input = {
      age: 65,
      heartRate: 80,
      systolicBloodPressure: 120,
      urea: 5,
      whiteBloodCellCount: 10,
      albumin: 30,
      asaGrade: 2,
      glasgowComaScore: 15,
      dyspnoea: 'No dyspnoea',
      urgency: 'BT 2 - 6',
      indicationForSurgery: 'sepsis',
      soiling: true,
    };
    const result = checkSchema(input);
    expect(result.error).toStrictEqual('Error checking schema');
  });
});
