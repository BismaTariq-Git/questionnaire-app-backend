import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import surveyRoutes from './routes/surveyroutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Set up CORS options
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://questionnaire-app-backend.vercel.app'  // Vercel URL
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests globally

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});



// Middleware to parse JSON requests
app.use(bodyParser.json())

// API Routes
app.use('/api', surveyRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

