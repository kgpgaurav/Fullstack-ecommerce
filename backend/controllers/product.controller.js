import Product from "../models/product.model.js"
import redis from "../lib/redis.js";

export const getAllProducts = async (req, res) => {
    try{
        const products= await Product.find({});//find all products
        res.json({products});
    }catch(error){
        console.log("Error in getALlProducts controller",error);
        res.status(500).json({message:error.message});
    }
}

export  const getFeaturedProducts=async(req, res)=>{
    try{
       let featuredProducts= await redis.get("featured_products");
       if(featuredProducts){
           return res.json(JSON.parse(featuredProducts));
       }

       //if not in redis, we should fetch from mongoDB
       //.lean is gonna return a plain javascript object instead of a mongoose object which is more efficient
       featuredProducts=await Product.find({isFeatured:true}).lean(); 

       if(!featuredProducts){
        return res.status(404).json({message:"Featured products not found"});
       }

       //store in redis for future quick access

       await redis.set("featured_products", JSON.stringify(featuredProducts));
    }catch(error){
        console.log("Error in getFeaturedProducts controller",error);
        res.status(500).json({message:error.message});
    }
}