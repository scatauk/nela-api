const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { calculateNelaRisk } = require('./calculate');
const { logger } = require('./logger');

function createServer() {
  // will log the message only if the NELA_DEBUG environment variable is set to true
  logger('DEBUG mode enabled');

  app.use(bodyParser.json());

  // Define the API route
  app.post('/nela-risk', (req, res) => {
    try {
      logger('NELA Risk Calculation Request:', req.body);
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
        return res.status(400).json({ error: 'Missing required fields' });
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
      res.json({ predictedRisk: predictedRisk, debug });
    } catch (error) {
      logger('Error calculating NELA risk:', error);
      res.status(400).json({ error: 'Invalid input' });
    }
  });

  // return html page if called with '/' route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../') + '/frontend/index.html');
  });

  app.get('/schema.json', (req, res) => {
    res.sendFile(__dirname + '/schema.json');
  });

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // eslint-disable-line no-console
  });
}

module.exports = createServer;
