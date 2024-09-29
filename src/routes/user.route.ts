import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controllers';

const router = Router();

// Route to get all users
router.get('/api/getAllUsers', getAllUsers);

export default router;
