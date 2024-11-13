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
    'http://localhost:3000', // Localhost for development
    'https://questionnaire-app-backend.vercel.app', // Vercel domain for production
  ],
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Allowed headers for requests
};

// Middleware to log requests (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Middleware to set Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; " +
    "script-src 'self' https://vercel.live https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https://images.unsplash.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://questionnaire-app-backend.vercel.app;"
  );
  next();
});

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow OPTIONS for all routes

// Middleware to parse JSON
app.use(bodyParser.json());

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
