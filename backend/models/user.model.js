import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:[true, "Name is required"]  //string also gives the message 
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password must be at least 6 characters long"]
    },
    cartItems:[
        {
            quantity:{
                type:Number,
                default:1
            },
            product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
            }
        }
    ],
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    }
    },
    {//createdAt, updatedAt
        timestamps:true
    }
);

//Pre-save hook to hash password before saving to database
userSchema.pre("save", async function(next){
    try{
        if(!this.isModified("password")) 
            return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
            
        next();
    }
    catch(error){
        next(error)
    }
})
//If you are using Mongoose, methods is an object where you can define instance methods for your schema. These methods can be called on instances of the model.
userSchema.methods.compareP = async function(password){
    return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;