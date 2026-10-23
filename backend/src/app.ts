// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import vehicleRouter from './routes/vehicles';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehicleRouter);

export default app;
