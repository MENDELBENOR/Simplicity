import express from 'express';
import { getAllUsers, createUser, searchUsers, updateUser, deleteUserByEmail, exportUsers, login, logout, loginWithGoogle } from '../controllers/user.controllers';

const userRouter = express.Router()

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);
userRouter.patch('/updateUser', updateUser);
userRouter.get('/searchUser/:text', searchUsers);
userRouter.delete("/deleteUser", deleteUserByEmail);
userRouter.get('/export', exportUsers);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/loginWithGoogle', loginWithGoogle);

export default userRouter;
