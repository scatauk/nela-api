import { beforeAll, afterAll, describe, expect, expectTypeOf, test, vi } from 'vitest';
import createServer from '../src/server';
import { maxIndication, getIndications } from './calculator.test.mjs';

const mockServer = vi.fn(createServer);

mockServer();

const BEFORE_ALL_TIMEOUT = 30000; // 30 sec

describe('Request to / returns the interactive front end', () => {
  let response;
  let body;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000');
    body = await response.text();
  }, BEFORE_ALL_TIMEOUT);

  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });

  test('Should have content-type HTML', () => {
    expect(response.headers.get('Content-Type')).toBe('text/html; charset=UTF-8');
  });

  test('Should have array in the body', () => {
    expectTypeOf(body).toBeArray();
  });

  test('One of the elements in the array should contain `NELA Risk Calc API`', () => {
    expect(body).to.have.string('NELA Risk Calc API');
  });
});

// test malformed JSON in request
describe('Request to /nela-risk with malformed JSON returns an error', () => {
  let response;
  let body;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000/nela-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'malformed JSON',
    });
    body = await response.json();
  }, BEFORE_ALL_TIMEOUT);

  test('Should have response status 400', () => {
    expect(response.status).toBe(400);
  });

  test('Should have content-type JSON', () => {
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
  });

  test('Should have array in the body', () => {
    expectTypeOf(body).toBeArray();
  });

  test('Error message is `Invalid JSON`', () => {
    expect(body.error).toBe('Invalid JSON');
  });
});

describe('Request to /schema.json returns the expected schema in JSON', () => {
  let response;
  let body;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000/schema.json');
    body = await response.json();
  }, BEFORE_ALL_TIMEOUT);

  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });

  test('Should have content-type JSON', () => {
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=UTF-8');
  });

  test('Should have array in the body', () => {
    expectTypeOf(body).toBeArray();
  });

  test('$schema key should be http://json-schema.org/draft-07/schema#', () => {
    expect(body['$schema']).to.have.string('http://json-schema.org/draft-07/schema#');
  });
});

describe('Valid POST request to /nela-risk returns a risk score', () => {
  let response;
  let body;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000/nela-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: 65,
        heartRate: 85,
        systolicBloodPressure: 130,
        urea: 7,
        whiteBloodCellCount: 12,
        albumin: 30,
        asaGrade: 3,
        glasgowComaScore: 14,
        malignancy: 'Nodal',
        dyspnoea: 'Dyspnoea at rest/rate >30 at rest or CXR: fibrosis or consolidation',
        urgency: 'BT 2 - 6',
        indicationForSurgery: 'sepsis',
        soiling: true,
      }),
    });
    body = await response.json();
  }, BEFORE_ALL_TIMEOUT);

  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });

  test('Should have content-type JSON', () => {
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
  });

  test('Should have array in the body', () => {
    expectTypeOf(body).toBeArray();
  });

  test('Mortality risk for test data is 22.151%', () => {
    expect(body.predictedRisk).toBe(22.151);
  });
});

describe('POST request to /nela-risk with invalid input returns an error', () => {
  let response;
  let body;

  beforeAll(async () => {
    response = await fetch('http://localhost:3000/nela-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: 65,
        systolicBloodPressure: 130,
        urea: 7,
        whiteBloodCellCount: 12,
        albumin: 30,
        asaGrade: 3,
        glasgowComaScore: 14,
        malignancy: 'Nodal',
        dyspnoea: 'Dyspnoea at rest/rate >30 at rest or CXR: fibrosis or consolidation',
        urgency: 'BT 2 - 6',
        indicationForSurgery: 'sepsis',
        soiling: true,
      }),
    });
    body = await response.json();
  }, BEFORE_ALL_TIMEOUT);

  test('Should have response status 400', () => {
    expect(response.status).toBe(400);
  });

  test('Should have content-type JSON', () => {
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
  });

  test('Should have array in the body', () => {
    expectTypeOf(body).toBeArray();
  });

  test('Error message is `Missing required fields`', () => {
    expect(body.error).toBe('Missing required fields');
  });
});

describe('If API fails, an error is thrown', () => {
  let originalMath;
  let response;
  let body;
  beforeAll(async () => {
    originalMath = global.Math;
    global.Math = {
      min: vi.fn(),
      max: vi.fn(),
      pow: vi.fn(),
      log: vi.fn(),
      abs: vi.fn(),
      floor: vi.fn(),
    };
    try {
      response = await fetch('http://localhost:3000/nela-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: 65,
          heartRate: 85,
          systolicBloodPressure: 130,
          urea: 7,
          whiteBloodCellCount: 12,
          albumin: 30,
          asaGrade: 3,
          glasgowComaScore: 14,
          malignancy: 'Nodal',
          dyspnoea: 'Dyspnoea at rest/rate >30 at rest or CXR: fibrosis or consolidation',
          urgency: 'BT 2 - 6',
          indicationForSurgery: 'sepsis',
          soiling: true,
        }),
      });
      body = await response.text();
    } catch (error) {
      body = error;
    }
  }, 5000);

  afterAll(() => {
    global.Math = originalMath;
  });

  test('Should have response status 400', async () => {
    await expect(body.split('\n')[4]).toBe('<title>Error</title>');
  });
});

describe('Test vectors file through API', () => {
  // load sim.csv
  const fs = require('fs');
  const path = require('path');
  // read whole of sim.csv into variable
  const data = fs.readFileSync(path.resolve(__dirname, '../test/sim.csv'), 'utf8');
  // split into lines
  const lines = data.split('\n');
  // for each line, split into fields
  for (let i = 1; i < lines.length; i++) {
    // for (let i = 4175; i < 4176; i++) {
    const fields = lines[i].split(',');
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
      soiling: fields[43] === 'Free pus blood or bowel contents',
    };
    // fields[46] is intercept - skip if empty
    if (fields[46] !== '') {
      // check predictedRisk is correct
      test(`predictedRisk is correct for test vector ${i}`, async () => {
        let response;
        let body;

        response = await fetch('http://localhost:3000/nela-risk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });
        body = await response.json();
        expect(body.predictedRisk).toBe(parseFloat(fields[78]));
      });
    }
  }
});
