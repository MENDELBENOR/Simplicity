import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);

export default userRouter;
