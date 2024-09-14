const { logger } = require('./logger');

function checkSchema(schema) {
  // load schema from schema.json and check input matches the types listed
  try {
    const schemaFile = require('./schema.json');
    const inputKeys = Object.keys(schema);
    const schemaKeys = Object.keys(schemaFile.properties);
    const schemaTypes = Object.values(schemaFile.properties).map((x) => x.type);
    const inputTypes = Object.values(schema).map((x) => typeof x);
    if (inputKeys.length !== schemaKeys.length) {
      return { result: false, error: 'Input keys do not match schema keys' };
    }
    for (let i = 0; i < schemaKeys.length; i++) {
      if (inputKeys[i] !== schemaKeys[i] || inputTypes[i] !== schemaTypes[i]) {
        if (schemaTypes[i] === 'integer' && inputTypes[i] === 'number') {
          continue;
        } else {
          return {
            result: false,
            error: `Input type mismatch for ${inputKeys[i]} (it is '${inputTypes[i]}' but should be '${schemaTypes[i]}')`,
          };
        }
      }
    }
    return { result: true };
  } catch (error) {
    return { result: false, error: 'Error checking schema', errorDetails: error };
  }
}

function calculateNelaRisk(input) {
  // Check if input is valid
  const validate = checkSchema(input);
  if (!validate.result) {
    throw validate.error;
  }
  try {
    // Centered variables
    const ageCent = input.age - 64;
    const pulseCent = Math.min(145, Math.max(55, input.heartRate)) - 91;
    const systolicBP_Cent = Math.min(190, Math.max(70, input.systolicBloodPressure)) - 127;

    let ureaCent = Math.log(input.urea);
    ureaCent = Math.min(3.7, Math.max(0.5, ureaCent)) - 1.9;

    let wccCent = Math.log(input.whiteBloodCellCount);
    wccCent = Math.min(3.6, Math.max(0.8, wccCent)) - 2.4;

    // Calculate individual components
    const ageComponent = 0.0666 * ageCent;
    const asaComponent =
      input.asaGrade === 3 ? 1.13007 : input.asaGrade === 4 ? 1.76293 : input.asaGrade === 5 ? 2.55345 : 0;
    const asaAgeInteraction =
      input.asaGrade === 3
        ? -0.03021 * ageCent
        : input.asaGrade === 4
          ? -0.03356 * ageCent
          : input.asaGrade === 5
            ? -0.04676 * ageCent
            : 0;
    const albuminComponent = -0.04323 * Math.min(55, Math.max(10, input.albumin));
    const pulseComponent = 0.01265 * pulseCent - 0.00012 * Math.pow(pulseCent, 2);
    const systolicBP_Component = -0.00683 * systolicBP_Cent + 0.00011 * Math.pow(systolicBP_Cent, 2);
    const lnUreaComponent = 0.38002 * ureaCent;
    const lnWBCComponent = 0.02041 * wccCent + 0.24153 * Math.pow(wccCent, 2);
    const gcsComponent = input.glasgowComaScore < 14 ? 0.6448 : input.glasgowComaScore === 14 ? 0.41557 : 0;
    const malignancyComponent =
      input.malignancy === 'Nodal'
        ? 0.5061
        : input.malignancy === 'Distant'
          ? 0.94309
          : input.malignancy === 'Primary only'
            ? 0.19201
            : 0;
    const respiratoryComponent =
      input.dyspnoea === 'Dyspnoea on exertion or CXR: mild COAD'
        ? 0.35378
        : input.dyspnoea === 'Dyspnoea limiting exertion to <1 flight or CXR: moderate COAD' ||
            input.dyspnoea === 'Dyspnoea at rest/rate >30 at rest or CXR: fibrosis or consolidation'
          ? 0.607
          : 0;
    const urgencyComponent =
      input.urgency === 'LT 2'
        ? 0.5731
        : input.urgency === 'BT 2 - 6'
          ? 0.14779
          : input.urgency === 'BT 6 - 18'
            ? 0.03782
            : 0;
    const indicationComponent =
      input.indicationForSurgery === 'sepsis'
        ? 0.02812
        : input.indicationForSurgery === 'ischaemia'
          ? 0.56948
          : input.indicationForSurgery === 'bleeding'
            ? -0.40615
            : 0;
    const soilingComponent = input.soiling ? 0.29453 : 0;

    // Log each component to debug
    logger(`Age Component: ${ageComponent}`);
    logger(`ASA Component: ${asaComponent}`);
    logger(`ASA-Age Interaction: ${asaAgeInteraction}`);
    logger(`Albumin Component: ${albuminComponent}`);
    logger(`Pulse Component: ${pulseComponent}`);
    logger(`Systolic BP Component: ${systolicBP_Component}`);
    logger(`Ln Urea Component: ${lnUreaComponent}`);
    logger(`Ln WBC Component: ${lnWBCComponent}`);
    logger(`GCS Component: ${gcsComponent}`);
    logger(`Malignancy Component: ${malignancyComponent}`);
    logger(`Respiratory Component: ${respiratoryComponent}`);
    logger(`Urgency Component: ${urgencyComponent}`);
    logger(`Indication Component: ${indicationComponent}`);
    logger(`Soiling Component: ${soilingComponent}`);

    // store these logged components in an object
    const components = {
      ageComponent,
      asaComponent,
      asaAgeInteraction,
      albuminComponent,
      pulseComponent,
      systolicBP_Component,
      lnUreaComponent,
      lnWBCComponent,
      gcsComponent,
      malignancyComponent,
      respiratoryComponent,
      urgencyComponent,
      indicationComponent,
      soilingComponent,
    };

    // Calculate the logit
    const logit =
      -3.04678 +
      ageComponent +
      asaComponent +
      asaAgeInteraction +
      albuminComponent +
      pulseComponent +
      systolicBP_Component +
      lnUreaComponent +
      lnWBCComponent +
      gcsComponent +
      malignancyComponent +
      respiratoryComponent +
      urgencyComponent +
      indicationComponent +
      soilingComponent;

    // Logit to probability
    const predictedRisk = 1 / (1 + Math.exp(-logit));

    // Log the final logit and predicted risk
    logger(`Final Logit: ${logit}`);
    logger(`Predicted Risk: ${parseFloat((predictedRisk * 100).toFixed(3))}`);

    return { predictedRisk: parseFloat((predictedRisk * 100).toFixed(3)), debug: components };
  } catch (error) {
    throw 'Error calculating NELA risk: ' + error;
  }
}

module.exports = { calculateNelaRisk, checkSchema };
