import { Router } from 'express';
import { getAllUsers, createUser, updateUser } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);
userRouter.patch('/updateUser', updateUser);

export default userRouter;
