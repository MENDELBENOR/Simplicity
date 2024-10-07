import { Router } from 'express';
import { getAllUsers, createUser, searchUsers, updateUser, deleteUserByEmail,exportUsers } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);
userRouter.patch('/updateUser', updateUser);
userRouter.get('/searchUser', searchUsers);
userRouter.delete("/deleteUser", deleteUserByEmail);
userRouter.get('/export',exportUsers);

export default userRouter;
