import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import { connectDB } from './lib/db.js';
import { validateEnvironment } from './lib/validateEnv.js';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

dotenv.config();
validateEnvironment();

const app=express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({limit:'5mb'})); //allows to parse json data of request body
app.use(express.urlencoded({limit:"5mb" ,extended:true})); //allows to parse urlencoded data of request body
app.use(cookieParser());

const __dirname = path.resolve();

app.use("/api/auth", authRoutes); 
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);
//app.use("api/analytics",require('./routes/analytics.route.js'));


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log('Server is running on http://localhost:'+PORT);
    connectDB();
});