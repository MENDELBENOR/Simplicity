import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.schema';
import { buildResponse } from '../utils/helper'



// שליפת כל המשתמשים ושליחה לאדמין
const getAllUsers = async (req: Request, res: Response): Promise<void> => {

  try {

    const users = await User.find();

    if(!users || users.length === 0 ){
      throw new Error('No users found');
    }
    
    const response = buildResponse( true, 'Fetched all users successfully', null, null, users );
    res.status(200).json(response);

  } catch (error) {

    const response = buildResponse ( 
      false, 'Failed to load users', null, error instanceof Error ? error.message : 'Unknown error', null,
    );

    res.status(500).json(response);
  }
};



// יצירת משתמש חדש
const createUser = async (req: Request, res: Response) => {

  const { firstName, lastName, email, phone, password, icon } = req.body;
  
  // Check if all fields are provided 
  if (!firstName || !lastName || !email || !phone || !password) {

    const response =  buildResponse (
      false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null  
      );

    res.status(400).json(response);
    return;
  }

  try {
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      const response = buildResponse ( false, 'User already exists', null, null, null );
      res.status(400).json(response);
      return;
    }
    // Create new user
    // Hash the password
    let newPassword: string = await bcrypt.hash(password, 10);
    console.log(newPassword);
    let newUser = new User({ firstName, lastName, email, phone, password: newPassword, icon });
    await newUser.save();
    newUser.password = '*****';
    const response = buildResponse ( true, 'New user successfully created', null, null, newUser )
    res.status(200).json(response);

  } catch (err) {
    const response = buildResponse ( 
      false, 'Error creating user', null, err instanceof Error ? err.message : 'Unknown error', null 
    );
    res.status(500).json(response);
  }
};




// עדכון משתמש קיים
const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, _id } = req.body;

  // בדיקת שדות שהתקבלו
  if (!firstName || !lastName || !phone) {

    const response = buildResponse (
      false, 'No information for update',  null, 'No matching parameter was received', null
    );
    
    res.status(400).json(response);
    return;
  }

  // בדיקת אורך השם הפרטי והמשפחה
  if (firstName.length < 2 || lastName.length < 2) {
    const response = buildResponse (
      false, 'First and last name must be at least 2 characters long',  null, 'First or last name is shorter than the required length', null
    );
    res.status(400).json(response);
    return;
  }

  // בדיקת אורך הטלפון (נניח שבישראל זה 10 ספרות)
  const phoneRegex = /^[0-9+\-]{9,14}$/;
  if (!phoneRegex.test(phone)) {
    const response = buildResponse (
      false, 'Phone number must be between 9 and 14 digits and can include + or - at the beginning',
      null, 'Invalid phone number', null
    );
    res.status(400).json(response);
    return;
  }

  try {
    // חיפוש המשתמש לפי ה-ID
    const user = await User.findById(_id);
    if (!user) {

      const response = buildResponse ( false, 'User not found', null, null, null );

      res.status(404).json(response);
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
    const response = buildResponse ( true, 'User successfully updated', null, null, user );

    res.status(200).json(response);

  } catch (err) {
    const response = buildResponse ( 
      false, 'Error updating user', null, err instanceof Error ? err.message : 'Unknown error', null 
    );

    res.status(500).json(response);
  }
};

export { getAllUsers, createUser, updateUser };








