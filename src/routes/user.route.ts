import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/user.controllers';

const router = Router();

// Route to get all users
router.get('/getAllUsers', getAllUsers);
router.post('/createUser', createUser);

export default router;
