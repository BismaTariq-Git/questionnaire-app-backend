import express from 'express';
import { createOrUpdateSurvey, getSurvey, finalizeSurvey, } from '../controllers/surveyControllers.js';  // Correct import


const router = express.Router();


router.post('/survey', createOrUpdateSurvey);


router.get('/survey/progress', getSurvey);
 

router.post('/survey/submit-survey', finalizeSurvey  );
  
export default router;
