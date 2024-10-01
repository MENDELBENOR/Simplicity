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
const createUser = async (req: Request, res: Response) => {
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

export { getAllUsers, createUser, deleteUserByEmail };





