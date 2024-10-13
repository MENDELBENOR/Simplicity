import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.schema';
import { buildResponse } from '../utils/helper';
import { ServerResponse } from '../utils/types';
import { write, utils } from 'xlsx';
import {createToken} from '../utils/helper'


// שליפת כל המשתמשים ושליחה לאדמין
const getAllUsers = async (req: Request, res: Response): Promise<void> => {

  try {

    const users = await User.find();


    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    const response = buildResponse(true, 'Fetched all users successfully', null, null, users);
    res.status(200).json(response);

  } catch (error) {

    const response = buildResponse(
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

    const response = buildResponse(
      false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null
    );

    res.status(400).json(response);
    return;
  }

  try {
    // בודק אם המשתמש כבר קיים
    const user = await User.findOne({ email });
    if (user) {
      const response = buildResponse(false, 'User already exists', null, null, null);
      res.status(400).json(response);
      return;
    }
    // יצירת משתמש חדש
    // הצפנה של הקוד
    let newPassword: string = await bcrypt.hash(password, 10);

    let newUser = new User({ firstName, lastName, email, phone, password: newPassword, icon });
    await newUser.save();
    newUser.password = '*****';
    const response = buildResponse(true, 'New user successfully created', null, null, newUser)
    res.status(200).json(response);

  } catch (err) {
    const response = buildResponse(
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

    const response = buildResponse(
      false, 'No information for update', null, 'No matching parameter was received', null
    );

    res.status(400).json(response);
    return;
  }

  // בדיקת אורך השם הפרטי והמשפחה
  if (firstName.length < 2 || lastName.length < 2) {
    const response = buildResponse(
      false, 'First and last name must be at least 2 characters long', null, 'First or last name is shorter than the required length', null
    );
    res.status(400).json(response);
    return;
  }

  // בדיקת אורך הטלפון (נניח שבישראל זה 10 ספרות)
  const phoneRegex = /^[0-9+\-]{9,14}$/;
  if (!phoneRegex.test(phone)) {
    const response = buildResponse(
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

      const response = buildResponse(false, 'User not found', null, null, null);

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
    const response = buildResponse(true, 'User successfully updated', null, null, user);

    res.status(200).json(response);

  } catch (err) {
    const response = buildResponse(
      false, 'Error updating user', null, err instanceof Error ? err.message : 'Unknown error', null
    );

    res.status(500).json(response);
  }
};

// פונקציה לחיפוש משתמש
const searchUsers = async (req: Request, res: Response) => {
  try {
    const {text} = req.params;
    const users = await User.find();
    const allUsers = users.filter(user => user.firstName.match(text) || user.lastName.match(text) || user.email.match(text));
    if (allUsers.length == 0) {
      const response = buildResponse(false, 'The user does NOT exist', null, null, null);
      res.status(404).json(response);
      return;
    }
    const response = buildResponse(true, 'Search users successfully', null, null, allUsers);
    res.status(200).json(response);
    // למקרה ויש ERROR
  } catch (err) {
    const response = buildResponse(false, 'Failed to search users', null, err instanceof Error ? err.message : 'Unknown error', null);
    res.status(500).json(response);
  }
};

//delete by email
const deleteUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      const response = buildResponse(false, 'User not found', null, null, null);
      res.status(404).json({ response })
      return;
    }
    const response = buildResponse(true, 'User deleted successfully', null, null, null);
    res.status(200).json({ response })
    return;
  } catch (error) {
    res.status(500).json({ message: error })
  }
}



const exportUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      throw new Error('לא נמצאו משתמשים');
    }

    // פורמט את נתוני המשתמשים כך שיכללו רק שדות נחוצים
    const formattedUsers = users.map(({ _id, firstName, lastName, email, phone }) => ({
      ID: _id,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Phone: phone,
    }));

    const ws = utils.json_to_sheet(formattedUsers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'משתמשים');

    // יצירת Buffer מהקובץ
    const buffer = write(wb, { bookType: 'xlsx', type: 'buffer' });
    const base64File = buffer.toString('base64'); // המרת ה-Buffer ל-base64

    // הגדרת התגובה
    const response = buildResponse(true, 'ייצוא משתמשים הצליח', null, null, base64File);
    res.status(200).json(response); // שליחת התגובה

  } catch (error) {
    const response = buildResponse(
      false, 'נכשל בייצוא המשתמשים', null, error instanceof Error ? error.message : 'שגיאה לא ידועה', null,
    );
    res.status(500).json(response);
  }
};

//login
const login = async (req: Request, res: Response)=>{
  try{
    const { email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user){
      const response = buildResponse(false, 'The user does NOT exist', null, null, null);
      res.status(401).json(response);
      return;
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      const response = buildResponse(false, 'Invalid credentials', null, null, null);
      res.status(401).json(response);
      return;
    };
    const token = createToken(user._id);
    res.cookie('token', token,{
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });
    const response = buildResponse(true, 'Login successful', null, null, user);
    res.status(200).json(response);
  }catch(err){
    const response = buildResponse(false, 'Failed to login', null, err instanceof Error ? err.message : 'Unknown error', null);
    res.status(500).json(response);
  };
};

// login With Google
const loginWithGoogle = async (req: Request, res: Response) => {
  try{
    const { email} = req.body;
    const user = await User.findOne({ email });
    if(!user){
      const response = buildResponse(false, 'The user does NOT exist', null, null, null);
      res.status(401).json(response);
      return;
    };
    const token = createToken(user._id);
    res.cookie('token', token,{
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });
    const response = buildResponse(true, 'Login successful', null, null, user)
    res.status(200).json(response);
  }catch (err){
    const response = buildResponse(false, 'Failed to login', null, err instanceof Error? err.message : 'Unknown error', null);
    res.status(500).json(response);
  }
}

//logout
const logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
    });

    const response = buildResponse(true, 'Logout successful', null, null, null);
    res.status(200).json(response);

  } catch (error) {
    const response = buildResponse(
      false, 'Failed to logout', null, error instanceof Error ? error.message : 'Unknown error', null
    );
    res.status(500).json(response);
  }
};



export { getAllUsers, createUser, searchUsers, updateUser, deleteUserByEmail, exportUsers, login, logout, loginWithGoogle };
