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


export interface ServerResponse<T> {
    isSuccessful: boolean;               // האם הבקשה הצליחה
    displayMessage: string | null;       // הודעה למשתמש
    description: string | null;          // תיאור נוסף (אם קיים)
    exception: string | null;            // תיאור החריגה (אם קרתה שגיאה)
    data: T | null;                             // כל המידע הקשור לבקשה
}
