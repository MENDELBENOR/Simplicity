import mongoose, { Document } from 'mongoose';

export interface IUser extends Document{
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    workSpaceList:string[],
    icon: string,
}
  