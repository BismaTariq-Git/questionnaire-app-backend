import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import surveyRoutes from './routes/surveyroutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to handle request timeout
app.use((req, res, next) => {
  res.setTimeout(20000, () => {  // Set the timeout to 20 seconds
    console.log('Request timed out');
    res.status(504).send('Request timed out');
  });
  next();
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// CORS Middleware - improve the CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://questionnaire-app-iota.vercel.app'];  // Add your production URL here
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);  // Set allowed origin dynamically
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');  // Allow credentials to be sent with requests

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);  // Send OK for OPTIONS request
  }
  
  next();
});

// Middleware to log requests (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use('/api', surveyRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
