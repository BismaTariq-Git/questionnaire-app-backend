import express from 'express';
import cors from 'cors';

import { createOrUpdateSurvey, getSurvey, finalizeSurvey, } from '../controllers/surveyControllers.js';  // Correct import


const router = express.Router();

router.options('/survey', cors());
router.options('/survey/progress', cors());
router.options('/survey/submit-survey', cors());



router.post('/survey', createOrUpdateSurvey);


router.get('/survey/progress', getSurvey);
 

router.post('/survey/submit-survey', finalizeSurvey  );
  
export default router;
