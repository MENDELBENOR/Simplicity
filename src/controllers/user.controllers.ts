import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.schema'; // Ensure this import matches your project structure

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// פונקציה ליצירת משתמש חדש
const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, icon } = req.body;
  // בודק שכל השדות מלאים 
  if (!firstName || !lastName || !email || !phone || !password) {
    res.status(400).json({ message: 'Please provide all the required fields.' });
    return;
  }
  try {
    // בודק אם המשתמש כבר קיים
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }
    // יצירת משתמש חדש
    // הצפנה של הקוד
    let newPassword: string = await bcrypt.hash(password, 10);
    
    let newUser = new User({ firstName, lastName, email, phone, password: newPassword, icon });
    await newUser.save();
    newUser.password = '*****';
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};


// פונקציה לחיפוש משתמש
const searchUsers = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    // בודק אם השם פרטי לא NULL
    if (firstName) {
      const regex = new RegExp(firstName, 'i');
      const users = await User.find({ firstName:  regex});

      if (users.length > 0) {
        res.status(200).json(users);
        return;
      }
      res.status(404).json({ message: 'The user/s does not exist'});
      return;
    } 
    // בודק אם השם משפחה לא NULL
    if (lastName) {
      const regex = new RegExp(lastName, 'i');
      const users = await User.find({ lastName: regex });

      if(users.length > 0){
        res.status(200).json(users);
        return;
      }
      res.status(404).json({ message: 'The user/s does not exist'});
      return;
    }
    // בודק אם המייל לא NULL
    if (email) {
      const regex = new RegExp(email, 'i');
      const users = await User.find({ email: regex });

      if(users.length > 0){
      res.status(200).json(users);
      return;
      }
      res.status(404).json({ message: 'The user/s does not exist'});
      return;
    }
    // בודק אם הפלאפון לא NULL
    if (phone) {
      const regex = new RegExp(phone, 'i');
      const users = await User.find({ phone: regex });

      if(users.length > 0){
      res.status(200).json(users);
      return;
      }
      res.status(404).json({ message: 'The user/s does not exist'});
      return;
    }
    // אם כל השדות היו NULL
      res.status(400).json({ message: 'Please provide at least one search criteria.' });
      
    // למקרה ויש ERROR
  } catch (err) {
    res.status(500).json({ message: 'Searching user/s', error: err });
  }
};

export { getAllUsers, createUser, searchUsers };





