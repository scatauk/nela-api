import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest';
import createServer from '../src/server';

createServer();

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

  test('One of the elements in the array should contain <h1>NELA API</h1>', () => {
    expect(body).to.have.string('<h1>NELA API</h1>');
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

describe('POST request to /nela-risk returns a risk score', () => {
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
