import express from 'express';
import cors from 'cors';

import { createOrUpdateSurvey, getSurvey, finalizeSurvey } from '../controllers/surveyControllers.js';

const router = express.Router();

// Define the routes
router.post('/survey', createOrUpdateSurvey);
router.get('/survey/progress', getSurvey);
router.post('/survey/submit-survey', finalizeSurvey);

export default router;
