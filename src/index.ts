import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route'
import cookieParser from 'cookie-parser';


// Load environment variables from .env file
dotenv.config();
import('./DBconnect/DBconnect');
// Initialize express app
const app: Application = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(cors({
  origin: [`http://localhost:5173`],
  credentials: true,
}));
app.use(express.json()); // To parse incoming JSON requests
app.use(cookieParser());
app.use('/api', userRouter);

// Basic GET route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Users routes
app.use('/api/users', userRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

