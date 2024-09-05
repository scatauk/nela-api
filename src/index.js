const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

function logger(message) {
  if (process.env.NELA_DEBUG === "true") {
    console.log(message);
  }
}

// will log the message only if the NELA_DEBUG environment variable is set to true
logger("DEBUG mode enabled");

app.use(bodyParser.json());

function checkSchema(schema) {
  // load schema from schema.json and check input matches the types listed
  try {
    const schemaFile = require("./schema.json");
    const inputKeys = Object.keys(schema);
    const schemaKeys = Object.keys(schemaFile.properties);
    const schemaTypes = Object.values(schemaFile.properties).map((x) => x.type);
    const inputTypes = Object.values(schema).map((x) => typeof x);
    if (inputKeys.length !== schemaKeys.length) {
      return { result: false, error: "Input keys do not match schema keys" };
    }
    for (let i = 0; i < schemaKeys.length; i++) {
      logger(`Checking ${inputKeys[i]}: ${inputTypes[i]} against ${schemaKeys[i]}: ${schemaTypes[i]}`);
      if (inputKeys[i] !== schemaKeys[i] || inputTypes[i] !== schemaTypes[i]) {
        if (schemaTypes[i] === "integer" && inputTypes[i] === "number") {
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
    return { result: false, error: "Error checking schema" };
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
    const pulseCent = Math.max(input.heartRate, 40) - 91;
    const systolicBP_Cent = input.systolicBloodPressure - 127;
    const lnUreaCent = Math.log(input.urea) - 1.9;
    const lnWBCCent = Math.log(input.whiteBloodCellCount) - 2.4;

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
    const albuminComponent = -0.04323 * input.albumin;
    const pulseComponent = 0.01265 * pulseCent - 0.00012 * Math.pow(pulseCent, 2);
    const systolicBP_Component = -0.00683 * systolicBP_Cent + 0.00011 * Math.pow(systolicBP_Cent, 2);
    const lnUreaComponent = 0.38002 * lnUreaCent;
    const lnWBCComponent = 0.02041 * lnWBCCent + 0.24153 * Math.pow(lnWBCCent, 2);
    const gcsComponent = input.glasgowComaScore < 14 ? 0.6448 : input.glasgowComaScore === 14 ? 0.41557 : 0;
    const malignancyComponent =
      input.malignancy === "nodal"
        ? 0.5061
        : input.malignancy === "distant"
          ? 0.94309
          : input.malignancy === "primary"
            ? 0.19201
            : 0;
    const respiratoryComponent = input.dyspnoea === 2 ? 0.35378 : input.dyspnoea === 3 ? 0.607 : 0;
    const urgencyComponent =
      input.urgency === "<2hrs"
        ? 0.5731
        : input.urgency === "2-6hrs"
          ? 0.14779
          : input.urgency === "6-18hrs"
            ? 0.03782
            : 0;
    const indicationComponent =
      input.indicationForSurgery === "sepsis"
        ? 0.02812
        : input.indicationForSurgery === "ischaemia"
          ? 0.56948
          : input.indicationForSurgery === "bleeding"
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
    logger(`Predicted Risk: ${parseFloat((predictedRisk * 100).toFixed(2))}`);

    return { predictedRisk: parseFloat((predictedRisk * 100).toFixed(2)), debug: components };
  } catch (error) {
    throw "Error calculating NELA risk: " + error;
  }
}

// Define the API route
app.post("/nela-risk", (req, res) => {
  try {
    logger("NELA Risk Calculation Request:", req.body);
    const {
      age,
      heartRate,
      systolicBloodPressure,
      urea,
      whiteBloodCellCount,
      albumin,
      asaGrade,
      glasgowComaScore,
      malignancy,
      dyspnoea,
      urgency,
      indicationForSurgery,
      soiling,
    } = req.body;

    if (
      age == null ||
      heartRate == null ||
      systolicBloodPressure == null ||
      urea == null ||
      whiteBloodCellCount == null ||
      albumin == null ||
      asaGrade == null ||
      glasgowComaScore == null ||
      malignancy == null ||
      dyspnoea == null ||
      urgency == null ||
      indicationForSurgery == null ||
      soiling == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const input = {
      age,
      heartRate,
      systolicBloodPressure,
      urea,
      whiteBloodCellCount,
      albumin,
      asaGrade,
      glasgowComaScore,
      malignancy,
      dyspnoea,
      urgency,
      indicationForSurgery,
      soiling,
    };

    const { predictedRisk, debug } = calculateNelaRisk(input);
    if (predictedRisk < 0 || predictedRisk > 100) {
      throw new Error("Invalid input");
    }
    if (isNaN(predictedRisk)) {
      throw new Error("Invalid input");
    }
    res.json({ predictedRisk: predictedRisk, debug });
  } catch (error) {
    logger("Error calculating NELA risk:", error);
    res.status(400).json({ error: "Invalid input" });
  }
});

// return html page if called with '/' route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../") + "/frontend/index.html");
});

app.get("/schema.json", (req, res) => {
  res.sendFile(__dirname + "/schema.json");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  logger(`Server is running on http://localhost:${PORT}`);
});

module.exports = { calculateNelaRisk };
