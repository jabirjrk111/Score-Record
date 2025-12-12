import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';
import markRoutes from './routes/mark.routes';

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', markRoutes);

app.get('/', (req, res) => {
  res.send('Student Marks System API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
