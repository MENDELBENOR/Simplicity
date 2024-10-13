import express from 'express';
import { getAllUsers, createUser, searchUsers, updateUser, deleteUserByEmail, exportUsers, login, logout, loginWithGoogle } from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/middel'


const userRouter = express.Router()


userRouter.post('/createUser', createUser);

userRouter.get('/getAllUsers', authMiddleware, getAllUsers);
userRouter.patch('/updateUser', authMiddleware, updateUser);
userRouter.get('/searchUser/:text', authMiddleware, searchUsers);
userRouter.delete("/deleteUser", authMiddleware, deleteUserByEmail);
userRouter.get('/export', authMiddleware, exportUsers);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/loginWithGoogle', loginWithGoogle);

export default userRouter;
