import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.schema';
import { buildResponse } from '../utils/helper';
import {ServerResponse} from '../utils/types';

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

// פונקציה ליצירת משתמש חדש
const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, icon } = req.body;
  // בודק שכל השדות מלאים 
  if (!firstName || !lastName || !email || !phone || !password) {

    const response =  buildResponse (
      false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null  
      );

    res.status(400).json(response);
    return;
  }

  try {
    // בודק אם המשתמש כבר קיים
    const user = await User.findOne({ email });
    if (user) {
      const response = buildResponse ( false, 'User already exists', null, null, null );
      res.status(400).json(response);
      return;
    }
    // יצירת משתמש חדש
    // הצפנה של הקוד
    let newPassword: string = await bcrypt.hash(password, 10);
    
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

// פונקציה לחיפוש משתמש
const searchUsers = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    // בודק אם השם פרטי לא NULL
    if (firstName) {
      const regex = new RegExp(firstName, 'i');
      const users = await User.find({ firstName:  regex});

      if (users.length > 0) {
        const response:ServerResponse<object[]> = {
          isSuccessful: true,
          displayMessage: 'Fetched the users successfully',
          description: null,
          exception: null,
          data: [users]
         };
        res.status(200).json(response);
        return;
      }
      const response:ServerResponse<object[]> = {
        isSuccessful: false,
        displayMessage: 'The user/s does not exist.',
        description: null,
        exception: null,
        data: null,  
       };
      res.status(404).json(response);
      return;
    } 
    // בודק אם השם משפחה לא NULL
    if (lastName) {
      const regex = new RegExp(lastName, 'i');
      const users = await User.find({ lastName: regex });

      if(users.length > 0){
        const response:ServerResponse<object[]> = {
          isSuccessful: true,
          displayMessage: 'Fetched the users successfully',
          description: null,
          exception: null,
          data: [users]
         };
        res.status(200).json(response);
        return;
      }
      const response:ServerResponse<object[]> = {
        isSuccessful: false,
        displayMessage: 'The user/s does not exist.',
        description: null,
        exception: null,
        data: null,  
       };
      res.status(404).json(response);
      return;
    }
    // בודק אם המייל לא NULL
    if (email) {
      const regex = new RegExp(email, 'i');
      const users = await User.find({ email: regex });

      if(users.length > 0){
        const response:ServerResponse<object[]> = {
          isSuccessful: true,
          displayMessage: 'Fetched the users successfully',
          description: null,
          exception: null,
          data: [users]
         };
      res.status(200).json(response);
      return;
      }
      const response:ServerResponse<object[]> = {
        isSuccessful: false,
        displayMessage: 'The user/s does not exist.',
        description: null,
        exception: null,
        data: null,  
       };
      res.status(404).json(response);
      return;
    }
    // בודק אם הפלאפון לא NULL
    if (phone) {
      const regex = new RegExp(phone, 'i');
      const users = await User.find({ phone: regex });

      if(users.length > 0){
        const response:ServerResponse<object[]> = {
          isSuccessful: true,
          displayMessage: 'Fetched the users successfully',
          description: null,
          exception: null,
          data: [users]
         };
      res.status(200).json(response);
      return;
      }
      const response:ServerResponse<object[]> = {
        isSuccessful: false,
        displayMessage: 'The user/s does not exist.',
        description: null,
        exception: null,
        data: null,  
       };
      res.status(404).json(response);
      return;
    }
    // אם כל השדות היו NULL
    const response:ServerResponse<object[]> = {
      isSuccessful: false,
      displayMessage: 'Please provide at least one search criteria.',
      description: null,
      exception: null,
      data: null,  
     };
      res.status(400).json(response);
      
    // למקרה ויש ERROR
  } catch (err) {
    const response:ServerResponse<object[]> = {
      isSuccessful: false,
      displayMessage: 'Failed to search users',
      description: null,
      exception: err instanceof Error ? err.message : 'Unknown error',
      data: null,  
     };
    res.status(500).json(response);
  }
};

//delete by email
const deleteUserByEmail = async (req: Request, res: Response) => {
  const {email} = req.body;
  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' })
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' })
    return;
  } catch (error) {
    res.status(404).json({ message: error })
  }
}

export { getAllUsers, createUser, searchUsers, updateUser, deleteUserByEmail};