// סכמה ליצירת משתמש חדש
import mongoose, { Schema, Document } from 'mongoose';

// של משתמש typeהגדרת ה
export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    workSpaceList:string[],
    icon: string,
  }
  
 //  הגדרת הסכמה לשדות המשתמש
  const userSchema: Schema = new Schema({
    firstName: { type: String, required: true, minlength: 2 },                               // שם פרטי, נדרש
    lastName: { type: String, required: true, minlength: 2 },                               // שם משפחה, נדרש
    email: { type: String, required: true, unique: true },                                 // אימייל, ייחודי ונדרש
    phone: { type: String, required: true, unique: true },                                // מספר טלפון, ייחודי ונדרש  
    password: { type: String, required: true, minlength: 8,match: /^\$2b\$10\$.+/},    // סיסמהת ייחודי ונדרש מוגבל לספרות ואותיות לועזיות
    workSpaceList: { type: [String] },                                                  // חיבור ל workspaces
    icon: { type: String }                                                             // הוספת אייקון
  }, {
    timestamps: true                                                                  // מוסיף שדות לתארוך זמן יצירת היוזר, ולזמן עדכון היוזר
  });
  
  // יצירת המודל עבור הקולקציה "users"
  const User = mongoose.model<IUser>('User', userSchema);
  
  export default User;