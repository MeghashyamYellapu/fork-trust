import dotenv from 'dotenv';

// Configure dotenv FIRST before importing any other modules
dotenv.config();

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('- PORT:', process.env.PORT);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
console.log('- MONGO_URI:', process.env.MONGO_URI ? '***SET***' : 'NOT SET');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import qrRoutes from './routes/qr.js';
import miscRoutes from './routes/misc.js';
import marketPricesRoutes from './routes/marketPrices.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forktrust';

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/market-prices', marketPricesRoutes);
app.use('/api', miscRoutes);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error)?.message);
    console.warn('Starting server without database connection. Some endpoints may not work.');
  }
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

start();

export default app;


