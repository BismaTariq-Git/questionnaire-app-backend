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

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add frontend URLs
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type'],
  credentials: true, // Allow cookies or authentication tokens to be sent
};

// Middleware to set Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; " +
    "script-src 'self' https://vercel.live https://cdnjs.cloudflare.com; " + // Allow Vercel scripts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " + // Allow inline styles & Google Fonts
    "img-src 'self' data: https://images.unsplash.com; " + // Allow self, data URIs, and images from Unsplash
    "font-src 'self' https://fonts.gstatic.com; " + // Allow fonts from Google Fonts
    "connect-src 'self' https://questionnaire-app-backend.vercel.app;" // Update this to your backend URL
  );
  next();
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.use('/api', surveyRoutes);

// Default route for root URL
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
