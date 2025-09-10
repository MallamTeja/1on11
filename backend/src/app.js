import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import scholarRoutes from './routes/scholarRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowlist = (config.ORIGIN_ALLOWLIST || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!origin || allowlist.length === 0 || allowlist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/scholar', scholarRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
