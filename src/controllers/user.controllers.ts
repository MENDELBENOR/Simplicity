// פונקציות טיפול הקשורות למשתמשים
import { Request, Response } from 'express';
import User from '../models/user.schema';

// שליפת ושליחת כל המשתמשים 
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { getAllUsers };