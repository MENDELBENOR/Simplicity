import express from 'express';
import {
  getAllUsers,
  createUser,
  searchUsers,
  updateUser,
  deleteUserByEmail,
  exportUsers,
  login,
  logout,
  loginWithGoogle,
  getOneUser,
  otpService,
  verifyOTP
} from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/middel';

const userRouter = express.Router();

// נתיבים שלא מצריכים authMiddleware
userRouter.post('/createUser', createUser);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/loginWithGoogle', loginWithGoogle);
userRouter.post('/otpService', otpService);
userRouter.post('/verifyOTP', verifyOTP);

// כל הנתיבים הללו יעברו דרך authMiddleware
userRouter.use(authMiddleware);

userRouter.get('/getAllUsers', getAllUsers);
userRouter.patch('/updateUser', updateUser);
userRouter.get('/searchUser/:text', searchUsers);
userRouter.delete("/deleteUser/:email", deleteUserByEmail);
userRouter.post('/export', exportUsers);
userRouter.get('/revalidate', getOneUser);

export default userRouter;
