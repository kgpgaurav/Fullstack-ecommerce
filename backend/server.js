import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

dotenv.config();

const app=express();
app.use(express.json()); //allows to parse json data of request body
app.use(express.urlencoded({extended:true})); //allows to parse urlencoded data of request body
app.use(cookieParser());

app.use("/api/auth", authRoutes); 
app.use("/api/product", productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/payments",paymentRoutes);
app.use("api/analytics",analyticsRoutes);
//app.use("api/analytics",require('./routes/analytics.route.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log('Server is running on http://localhost:'+PORT);
    connectDB();
});