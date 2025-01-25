import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

import auth from './routes/auth.route.js';
import product from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { protectRoute } from './middleware/auth.middleware.js';
import { getProfile } from './controllers/auth.controller.js';

dotenv.config();

const app=express();
console.log(process.env.PORT);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/product", product);
app.use("/api/cart",cartRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/payments",paymentRoutes);
app.use("api/analytics",analyticsRoutes);
app.use("/api/profile",protectRoute, getProfile )
//app.use("api/analytics",require('./routes/analytics.route.js'));


app.listen(3000,()=>{
    console.log('Server is running on http://localhost:'+process.env.PORT);
    connectDB();
});