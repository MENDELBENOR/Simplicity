import { Router } from 'express';
import { getAllUsers, createUser, searchUsers } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);
userRouter.get('/searchUser', searchUsers);

export default userRouter;
