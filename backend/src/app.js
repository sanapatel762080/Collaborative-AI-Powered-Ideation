import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';


const app = express();


const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';


app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/auth', authRoutes);


export default app;