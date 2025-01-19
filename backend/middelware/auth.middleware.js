import jwt from "jsonwebtoken";
import userl from "../models/user.model.js";
export const protectRoute =async (req, res, next) => {
    try{
        const accessToken= req.cookies.accessToken;

        if(!accessToken){
            return res.status(401).json({message:"You need to login, no access token provided"});
        }
        try{
            const decoded=jwt.verify(accessToken, process.env.JSON_WEB_TOKEN);
        const user= await userl.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"User not found"});
        }

        req.user=user;

        next();
        }catch(error){
            if(error.name=="TokenExpiredError"){
                return res.status(401).json({message:"Access Token Expired"});
            }
            throw error
        }
        
    }catch(error){
        console.log("error in protectRoute middleware",error);
        res.status(401).json({message:"Unauthenticated af"});
    }
    
}

export const adminRoute=async(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    }else{
        return res.status(403).json({message:"Not authorized as an admin"});
    }
}
