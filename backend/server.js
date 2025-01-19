import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

import auth from './routes/auth.route.js';
import product from './routes/product.route.js';

dotenv.config();

const app=express();
console.log(process.env.PORT);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/product", product);


app.listen(3000,()=>{
    console.log('Server is running on http://localhost:'+process.env.PORT);
    connectDB();
});