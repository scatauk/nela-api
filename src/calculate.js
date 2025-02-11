/* c8 ignore next */
const { logger } = require('./logger');
/* c8 ignore next */
const { checkSchema } = require('./checkSchema');

// Helper functions
function calculateCenteredValues(input) {
  return {
    age: input.age - 64,
    pulse: Math.min(145, Math.max(55, input.heartRate)) - 91,
    systolicBP: Math.min(190, Math.max(70, input.systolicBloodPressure)) - 127,
    urea: Math.min(3.7, Math.max(0.5, Math.log(input.urea))) - 1.9,
    wcc: Math.min(3.6, Math.max(0.8, Math.log(input.whiteBloodCellCount))) - 2.4,
  };
}

function calculateComponents(input, centered) {
  const components = {
    ageComponent: 0.0666 * centered.age,
    asaComponent: input.asaGrade === 3 ? 1.13007 : input.asaGrade === 4 ? 1.76293 : input.asaGrade === 5 ? 2.55345 : 0,
    asaAgeInteraction:
      input.asaGrade === 3
        ? -0.03021 * centered.age
        : input.asaGrade === 4
          ? -0.03356 * centered.age
          : input.asaGrade === 5
            ? -0.04676 * centered.age
            : 0,
    albuminComponent: -0.04323 * Math.min(55, Math.max(10, input.albumin)),
    pulseComponent: 0.01265 * centered.pulse - 0.00012 * Math.pow(centered.pulse, 2),
    systolicBPComponent: -0.00683 * centered.systolicBP + 0.00011 * Math.pow(centered.systolicBP, 2),
    ureaComponent: 0.38002 * centered.urea,
    wccComponent: 0.02041 * centered.wcc + 0.24153 * Math.pow(centered.wcc, 2),
    gcsComponent: input.glasgowComaScore < 14 ? 0.6448 : input.glasgowComaScore === 14 ? 0.41557 : 0,
    malignancyComponent:
      input.malignancy === 'Nodal'
        ? 0.5061
        : input.malignancy === 'Distant'
          ? 0.94309
          : input.malignancy === 'Primary only'
            ? 0.19201
            : 0,
    respiratoryComponent:
      input.dyspnoea === 'Dyspnoea on exertion or CXR: mild COAD'
        ? 0.35378
        : input.dyspnoea === 'Dyspnoea limiting exertion to <1 flight or CXR: moderate COAD' ||
            input.dyspnoea === 'Dyspnoea at rest/rate >30 at rest or CXR: fibrosis or consolidation'
          ? 0.607
          : 0,
    urgencyComponent:
      input.urgency === 'LT 2'
        ? 0.5731
        : input.urgency === 'BT 2 - 6'
          ? 0.14779
          : input.urgency === 'BT 6 - 18'
            ? 0.03782
            : 0,
    indicationComponent:
      input.indicationForSurgery === 'sepsis'
        ? 0.02812
        : input.indicationForSurgery === 'ischaemia'
          ? 0.56948
          : input.indicationForSurgery === 'bleeding'
            ? -0.40615
            : 0,
    soilingComponent: input.soiling ? 0.29453 : 0,
  };

  // Log components for debugging
  Object.entries(components).forEach(([key, value]) => {
    logger(`${key}: ${value}`);
  });

  return components;
}

function calculateLogit(components) {
  return -3.04678 + Object.values(components).reduce((sum, value) => sum + value, 0);
}

function calculateNelaRisk(input) {
  // Validate input
  const validate = checkSchema(input);
  if (!validate.result) {
    throw validate.error;
  }

  try {
    // Calculate centered values
    const centered = calculateCenteredValues(input);

    // Calculate components
    const components = calculateComponents(input, centered);

    // Calculate logit and risk
    const logit = calculateLogit(components);
    const predictedRisk = 1 / (1 + Math.exp(-logit));

    // Log final calculations
    logger(`Final Logit: ${logit}`);
    logger(`Predicted Risk: ${parseFloat((predictedRisk * 100).toFixed(3))}`);

    return {
      predictedRisk: parseFloat((predictedRisk * 100).toFixed(3)),
      debug: components,
    };
  } catch (error) {
    throw 'Error calculating NELA risk: ' + error;
  }
}

module.exports = { calculateNelaRisk };
