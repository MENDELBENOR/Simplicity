// סכמה ליצירת משתמש חדש
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../utils/types'

//  הגדרת הסכמה לשדות המשתמש
const userSchema: Schema = new Schema({
  firstName: { type: String, required: true, minlength: 2 },                            
  lastName: { type: String, required: true, minlength: 2 },                              
  email: { type: String, required: true, unique: true },                          
  phone: { type: String, required: true, unique: true },                                
  password: { type: String, required: true, minlength: 8, match: /^\$2b\$10\$.+/ },    
  workSpaceList: { type: [String] },                                                 
  icon: { type: String, default: "" }                                                        
}, {
  timestamps: true                                                                 
});

// יצירת המודל עבור הקולקציה "users"
const User = mongoose.model<IUser>('user', userSchema);

export default User;