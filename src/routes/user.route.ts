import { Router } from 'express';
import { getAllUsers, createUser, deleteUserByEmail } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);
userRouter.delete("/deleteUser", deleteUserByEmail)

export default userRouter;
