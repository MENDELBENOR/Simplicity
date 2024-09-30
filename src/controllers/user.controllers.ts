import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.schema'; 
import {ServerResponse} from '../utils/types'

// שליפת כל המשתמשים ושליחה לאדמין
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {

    const users = await User.find();  

    const response:ServerResponse<object[]> = {
       isSuccessful: true,
       displayMessage: 'Fetched all users successfully',
       description: null,
       exception: null,
       data: users 
      };

    res.status(200).json(response);

  } catch (error) {

    const response:ServerResponse<object[]> = {
      isSuccessful: false,
      displayMessage: 'Failed to load users',
      description: null,
      exception: error instanceof Error ? error.message : 'Unknown error',
      data: null,  
     };
    res.status(500).json(response);
  }
};

// פונקציה ליצירת משתמש חדש
const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, icon } = req.body;
  // בודק שכל השדות מלאים 
  if (!firstName || !lastName || !email || !phone || !password) {
    const response:ServerResponse<object[]> = {
      isSuccessful: false,
      displayMessage: 'Please provide all the required fields.',
      description: null,
      exception: null,
      data: null,  
     };
    res.status(400).json(response);
    return;
  }
  try {
    // בודק אם המשתמש כבר קיים
    const user = await User.findOne({ email });
    if (user) {
      const response:ServerResponse<object[]> = {
        isSuccessful: false,
        displayMessage: 'User already exists.',
        description: null,
        exception: null,
        data: null,  
       };
      res.status(400).json(response);
      return;
    }
    // יצירת משתמש חדש
    // הצפנה של הקוד
    let newPassword: string = await bcrypt.hash(password, 10);
    
    let newUser = new User({ firstName, lastName, email, phone, password: newPassword, icon });
    await newUser.save();
    newUser.password = '*****';

    const response:ServerResponse<object[]> = {
      isSuccessful: true,
      displayMessage: 'Fetched the new user successfully',
      description: null,
      exception: null,
      data: [newUser]
     };

    res.status(200).json(response);
  } catch (err) {

    const response:ServerResponse<object[]> = {
      isSuccessful: false,
      displayMessage: 'Failed to create user',
      description: null,
      exception: err instanceof Error ? err.message : 'Unknown error',
      data: null,  
     };

    res.status(500).json(response);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, _id } = req.body;
  
  // בדיקת שדות שהתקבלו
  if (!firstName || !lastName || !phone) {
    res.status(400).json({ message: 'Please provide all the required fields.' });
    return;
  }

  // בדיקת אורך השם הפרטי והמשפחה
  if (firstName.length < 2 || lastName.length < 2) {
    res.status(400).json({ message: 'First name and last name must be at least 2 characters long.' });
    return;
  }

  // בדיקת אורך הטלפון (נניח שבישראל זה 10 ספרות)
const phoneRegex = /^[0-9+\-]{9,14}$/;
  if (!phoneRegex.test(phone)) {
    res.status(400).json({ message: 'Phone number must be between 9 and 14 digits and can include + or - at the beginning.' });
    return;
  }

  try {
    // חיפוש המשתמש לפי ה-ID
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // עדכון שם פרטי, שם משפחה וטלפון
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    // שמירת השינויים
    await user.save();

    // הסתרת הסיסמה בתגובה
    user.password = '*****';

    // החזרת המשתמש המעודכן בתגובה
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
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

export { getAllUsers, createUser, searchUsers, updateUser};





