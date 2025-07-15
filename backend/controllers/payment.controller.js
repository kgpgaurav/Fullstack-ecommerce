import Coupon from "../models/coupon.model.js";
import {Stripe} from "../lib/stripe.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async(req, res)=>{
    try{
        const {products, couponCode}=req.body;

        if(!Array.isArray(products) || products.length===0){
            return res.status(400).json({message:"Invalid or empty products array"});
        }

        let totalAmount=0;

        //each product is mapped into stripe's required format
        //and the total amount is calculated
        const lineItems= products.map(product=>{
            const amount = Math.round(product.price*100) //convert to cents, stripe wants u to send in the format of cents
            totalAmount+=amount*product.quantity;

            return{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:product.name,
                        images:[product.image],
                    },
                    unit_amount:amount,
                },
                quantity:product.quantity || 1,
            }
        });

        let coupon=null;
        if(couponCode){
            coupon= await Coupon.findOne({code:couponCode, userId:req.user._id, isActive:true});
            if(coupon){
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);  //amount reduced if the coupon if found for the user
            }
        }
        const session = await Stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
            discounts:coupon
                        ? [
                            {
                                coupon: await createStripeCoupon(coupon.discountPercentage),
                            }
                        ]
                        :[],
            metadata:{
                userId:req.user._id.toString(),
                couponCode:couponCode||"",
                products:JSON.stringify(products.map(product=>({
                    id:product._id,
                    quantity:product.quantity,
                    price:product.price,
                }))),
            },
        });

        if(totalAmount>=20000){
            await createNewCoupon(req.user._id);   //creating a new coupon for the user if the total amount spend is greater than $200
        }
        res.status(200).json({id:session.id, totalAmount:totalAmount/100}); //cents to dollars
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internali server error"});
    }
};


export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: "Missing sessionId" });
        }
        const session = await Stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // Check for existing order
            let existingOrder = await Order.findOne({ stripeSessionId: sessionId });
            if (existingOrder) {
                return res.status(200).json({
                    success: true,
                    message: "Order already exists for this session.",
                    orderId: existingOrder._id,
                });
            }

            //update the user's purchase history
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: session.metadata.couponCode,
                        userId: session.metadata.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }

            // create a new Order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // convert from cents to dollars,
                stripeSessionId: sessionId,
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });

        } else {
            return res.status(400).json({ message: "Payment not completed", status: session.payment_status });
        }
    } catch (error) {
        console.error("Error in checkout-success controller: ", error);
        res.status(500).json({ message: "Error processing successful checkout", error: error.message });
    }
};

async function createStripeCoupon(discountPercentage){
    const coupon= await Stripe.coupons.create({
        percent_off:discountPercentage,
        duration:"once",
    });
    return coupon._id;
}

async function createNewCoupon(userId){
    await Coupon.findOneAndDelete({userId}); //delete the old coupon if it exists

    const newCoupon = new Coupon({
        code:"GIFT" +Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage:10,
        expirationDate: new Date(Date.now()+1000*60*60*24*30), //30 days from now
        userId:userId,
    });
    await newCoupon.save();

    return newCoupon;
}