import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route';
import cookieParser from 'cookie-parser';
import projectRouter from './routes/project.route';
import groupRouter from './routes/group.route';
import taskRouter from './routes/task.route';
import  { authMiddleware } from './middlewares/middel';

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

app.use(express.json());
app.use(cookieParser());

app.use('/api', userRouter);

app.use(authMiddleware);
app.use('/project', projectRouter);
app.use('/group', groupRouter);
app.use('/task', taskRouter);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

