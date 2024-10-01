import { Router } from 'express';
import { getAllUsers, createUser, deleteUserByEmail } from '../controllers/user.controllers';
import { getAllUsers, createUser, searchUsers, updateUser } from '../controllers/user.controllers';

const userRouter = Router();

// Route to get all users
userRouter.get('/getAllUsers', getAllUsers);
userRouter.post('/createUser', createUser);
userRouter.patch('/updateUser', updateUser);
userRouter.get('/searchUser', searchUsers);
userRouter.delete("/deleteUser", deleteUserByEmail)

export default userRouter;
