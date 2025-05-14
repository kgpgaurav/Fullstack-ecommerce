import Product from "../models/product.model.js"
import {redis} from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try{
        const products= await Product.find({});//find all products
        res.json({products});
    }catch(error){
        console.log("Error in getALlProducts controller",error);
        res.status(500).json({message:error.message});
    }
};
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

export const createProduct = async (req, res)=>{
    try{
        const {name, description, price, image, category}= req.body;

        let cloudinaryResponse= null;

        if(image){
            await cloudinary.uploader.upload(image, {folder:"products"})
        }

        const products= await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse.secure_url? cloudinaryResponse.secure_url:"",
            category    
        })
    }catch(error){
        console.log("Error in createProduct controller",error);
        res.status(500).json({message:error.message});
    }
}

export const deleteProduct= async(req, res)=>{
    try{
        const product = await Product.findById(req.params.id);// id form /:id
        if(!product){
            return res.status(404).json({message:"Product not found"});

        }
        if(product.image){
            const publicId= product.image.split("/").pop().split(".")[0];//get the id of the image
        try{
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log("Image deleted from cloudinary");
        }catch(error){
            console.log("Error in deleteProduct controller from cloudinary",error);
        }

    } 
    await Product.findByIdAndDelete(req.params.id);
    res.json({message:"Product deleted successfully"});
}catch(error){
    console.log("Error in deleteProduct controller",error);
    res.status(500).json({message:error.message});
}
}

export const getRecommendedProducts=async(req,res)=>{
    try{
        const products= await Product.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    price:1,
                    image:1
                }
            }
        ])
    }catch(error){
        console.log("Error in getRecommendedProducts controller",error);
        res.status(500).json({message:error.message});

    }
}

export const getProductsByCategory= async(req, res)=>{
    const category=req.params;
    try{
        const products= await Product.find({category});
        res.json({products});
    }catch(error){
        console.log("Error in getProductsByCategory controller",error);
        res.status(500).json({message:error.message});
    }
}

export const toggleFeaturedProduct= async(req, res)=>{
    try{
        const product= await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        product.isFeatured= !product.isFeatured;
        const updatedProduct=await product.save();

        await updateFeaturedProductsCache() // Uncomment this line if the function is defined elsewhere

        res.json({updatedProduct, message:"Product updated successfully"});
    }catch(error){
        console.log("Error in toggleFeaturedProduct controller",error);
        res.status(500).json({message:error.message});
    }
}

async function updateFeaturedProductsCache(){
    try{
        //The lean() method is used to return a plain JavaScript object from a Mongoose object
        const featuredProducts= await Product.find({isFeatured:true}).lean();

        await redis.set("featured_products", JSON.stringify(featuredProducts));
    }catch(error){
        console.log("Error in updateFeaturedProductsCache controller",error);
    }
}