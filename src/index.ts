import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route';
import { authMiddleware } from './middlewares/middel'
import cookieParser from 'cookie-parser';

// Load environment variables from .env file
dotenv.config();
import('./DBconnect/DBconnect');
// Initialize express app
const app: Application = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests
app.use(cookieParser());


// Basic GET route
app.get('/', authMiddleware, (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Users routes
app.use('/api/users', userRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

