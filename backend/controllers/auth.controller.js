import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { redis } from "../lib/redis.js";

dotenv.config();

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}
const storeRefreshToken = async (userId, refreshToken) => {
    //setting the key value pair in redis
    //key= refresh-token:userId
    //value= refreshToken
    // await redis.set(`refresh-token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); //7days
    await redis.set(refreshToken, userId, {
    ex: 60 * 60 * 24 * 7, // expires in 7 days
    nx: true             // only set if not exists
    });
}
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production", //only send cookie over https in production
        sameSite: "strict", //prevent CSRF attacks, cross site request forgery
        maxAge: 15 * 60 * 1000//15 minutes
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production", //only send cookie over https in production
        sameSite: "strict", //prevent CSRF attacks, cross site request forgery
        maxAge: 7 * 24 * 60 * 60 * 1000//7 days
    })
}
export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({
            name,
            email,
            password
        });
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);  //need to save refresh token in redis

        setCookies(res, accessToken, refreshToken);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.log("error in signup controller", error);
        res.status(500).json({ message: error.message });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        //compareP is already defined in user.model.js
        if (user && (await user.compareP(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
        else {
            return res.status(400).json({ message: "Invalid email or password" }); //400 represents bad request
        }
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log("decoded", decoded);
            //decoded will provide us the userId
            await redis.del(`refresh-token:${decoded.userId}`);
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//to refresh the access token after the previous one expires
//we will use the refresh token to get a new access token
//we will check if the refresh token is valid and if it is, we will generate a new access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No Refresh Token provided" });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedtoken = await redis.get(`refresh-token:${decoded.userId}`);

        if (storedtoken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken= jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});

       res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production", //only send cookie over https in production
        sameSite: "strict", //prevent CSRF attacks, cross site request forgery
        maxAge: 15 * 60 * 1000//15 minutes
       })
       res.json({message: "Token Refreshed successfully"});
    } catch (error) {
        console.log("error in refreshToken controller",error.message);
        res.status(500).json({ message: "server error",error: error.message });
    }
}
export const getProfile = async (req, res) => {
    try{
        res.json(req.user);
    }catch(error){
        console.log("error in getProfile controller",error.message)
        res.status(500).json({message: error.message});
    }
}