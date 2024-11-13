import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import surveyRoutes from './routes/surveyroutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Use cors package for CORS configuration
app.use(cors({
  origin: '*', // Set this to specific domains in production as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

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
