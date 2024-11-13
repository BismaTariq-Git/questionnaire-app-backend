import express from 'express';
import cors from 'cors';

import { createOrUpdateSurvey, getSurvey, finalizeSurvey } from '../controllers/surveyControllers.js';

const router = express.Router();

// Allow CORS for the /survey and /submit-survey endpoints
router.options('/survey', cors());
router.options('/survey/progress', cors());

// Add the explicit OPTIONS handler for /submit-survey endpoint
router.options('/survey/submit-survey', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.sendStatus(200);
});

// Define the routes
router.post('/survey', createOrUpdateSurvey);
router.get('/survey/progress', getSurvey);
router.post('/survey/submit-survey', finalizeSurvey);

export default router;
