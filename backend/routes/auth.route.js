import express from "express";
import { login, logout, signup, refresh_Token } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/signup",signup);
router.post("/login", login);
router.post("/logout",logout);
router.post("/refresh",refresh_Token);
//router.get("/profile",protected getProfile);

 export default router;
