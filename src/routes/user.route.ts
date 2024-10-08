import express from 'express';
import { getAllUsers, createUser, searchUsers, updateUser, deleteUserByEmail, exportUsers } from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/middel'


const userRouter = express.Router()


userRouter.post('/createUser', createUser);

userRouter.get('/getAllUsers', authMiddleware, getAllUsers);
userRouter.patch('/updateUser', authMiddleware, updateUser);
userRouter.get('/searchUser', authMiddleware, searchUsers);
userRouter.delete("/deleteUser", authMiddleware, deleteUserByEmail);
userRouter.get('/export', authMiddleware, exportUsers);

export default userRouter;
