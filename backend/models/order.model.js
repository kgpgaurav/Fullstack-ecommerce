import mongoose from "mongoose";

const orderSchema= new mongoose.Schema(
    {
        //owner of the order will be some user
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        //in the order the user could have various projects so an array of objects
        products:[
            {
                //ref to the product model
                product: {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true,
                },
                quantity:{
                    type: Number,
                    required: true,
                    min: 1
                },
                price:{
                    type:Number,
                    required:true,
                    min:0,
                },
            },

        ],
        totalAmount:{
            type:Number,
            required:true,
            min:0,
        },
        stripeSessionId:{
            type:String,
            unique:true,
        },
    },
    {
        timestamps:true,
    }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;