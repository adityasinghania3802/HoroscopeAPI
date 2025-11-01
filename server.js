import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import horoscopeRoutes from './routes/horoscope.js';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/horoscope', horoscopeRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = 4000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/horoscope_api';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });
