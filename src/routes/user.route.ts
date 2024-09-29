import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);

export default userRouter;
