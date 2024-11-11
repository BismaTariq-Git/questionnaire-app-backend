// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import surveyRoutes from './routes/surveyroutes.js';


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'] 
  };
  
  
  app.use(cors(corsOptions));
  


// Middleware
app.use(bodyParser.json()); 

// Routes
app.use('/api', surveyRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
