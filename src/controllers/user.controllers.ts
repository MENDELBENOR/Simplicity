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



// יצירת משתמש חדש
const createUser = async (req: Request, res: Response)=> {
  const { firstName, lastName, email, phone, password, icon } = req.body;
  // Check if all fields are provided 
  if (!firstName || !lastName || !email || !phone || !password) {
    res.status(400).json({ message: 'Please provide all the required fields.' });
    return;
  }
  try {
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }
    // Create new user
    // Hash the password
    let newPassword: string = await bcrypt.hash(password, 10);
    console.log(newPassword);
    let newUser = new User({ firstName, lastName, email, phone, password: newPassword, icon });
    await newUser.save();
    newUser.password = '*****';
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
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

export { getAllUsers, createUser, updateUser };





