import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { redis } from "../lib/redis.js";

dotenv.config();

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JSON_WEB_TOKEN, { expiresIn: "15m" });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh-token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); //7days
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
        })
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);
        res.status(201).json({

            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        console.log("error in signup controller")
        res.status(500).json({ message: "Server error" });
    }
}



export const refresh_Token = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No Refresh Token provided" });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const token = await redis.get(`refresh-token:${decoded.userId}`);

        if (token !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken= jwt.sign({userId: decoded.userId}, process.env.JSON_WEB_TOKEN, {expiresIn: "15m"});

       res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production", //only send cookie over https in production
        sameSite: "strict", //prevent CSRF attacks, cross site request forgery
        maxAge: 15 * 60 * 1000//15 minutes
       })
       res.json({message: "Refresh token success"})
    } catch (error) {
        console.log("error in refreshToken controller")
        res.status(401).json({ message: "Unauthenticated" });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.compareP(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
        res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        console.log("error in login controller")
        res.status(500).json({ message: "Server error" });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
            await redis.del(`refresh-token:${decoded.userid}`)
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout controller")
        res.status(401).json({ message: "Server Error", error: error.message });
    }
}

