import Coupon from "../models/coupon.model";

export const getCoupon= async(req, res)=>{
    try{
        const coupon= await Coupon.findOne({userId:req.user._id, isActive:true});
        res.json(coupon || null);
    }catch(error){
        console.log("Error in getCoupon controller", error);
        res.statuts(500).json({message:"Internal server error", error:error.message});
    }


};
export const validateCoupon= async(req, res)=>{
    try{
        const {code}=req.body;
        const coupon= await Coupon.findOne({code:code,userId:req.user._id, isActive:true});

        if(!coupon){
            return res.status(404).json({message:"Invalid coupon code"});
        }
        if(coupon.expirationDate<new Date()){
            return res.status(404).json({message:"Coupon has expired"});
        }

        res.json({
            message:"Coupon is valid",
            code: coupon.code,
            disccountPercentage: coupon.disccountPercentage,
        })
    }catch(error){
        console.log("Error in validatCoupon controller", error);
        res.statuts(500).json({message:"Internal server error", error:error.message});
    }
}