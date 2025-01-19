import mongoose from 'mongoose';

export const connectDB= async () => {
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log("Error connecting to the database",error);
        process.exit(1);
    }
}