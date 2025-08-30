// src/server.ts

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import {handler} from "./utils/keepAlive"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow your frontend origin
  credentials: true, // If you need to send cookies or Authorization headers
};

app.use(cors(corsOptions)); // Use cors with options
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.get('/', (req: Request, res: Response) => {
  console.log("Root route accessed"); // Add this line
  res.send('Welcome to HD Notes API');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Run every 5 min
  setInterval(() => {
    handler();
  }, 5 * 60 * 1000);

  // Call once immediately at startup
  handler();

  handler()
});