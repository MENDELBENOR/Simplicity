import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017");
        console.log('MongoDB connected...');
    }catch(err){
        console.error('Error connecting to MongoDB');
    }
}
connectDB();
