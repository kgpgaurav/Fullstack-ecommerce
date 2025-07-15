import Product from "../models/product.model.js"; 

       
export const getCartProducts = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user.cartItems || user.cartItems.length === 0) {
            return res.json([]);
        }

        // Extract product IDs from cartItems
        const productIds = user.cartItems.map(item => item.product);

        // Fetch products from DB
        const products = await Product.find({ _id: { $in: productIds } });

        // Merge quantity info with product details
        const cartItems = products.map((product) => {
            const item = user.cartItems.find(
                (cartItem) => cartItem.product && cartItem.product.toString() === product._id.toString()
            );
            return { ...product.toJSON(), quantity: item ? item.quantity : 1 };
        });

        res.json(cartItems);
    } catch(error){
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({message: "server error", error: error.message});
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user; //the route was protected and we have send req.user = user in middleware so can get this here

        const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in removeAllFromCart controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;

        const user = req.user;
        
        // Add validation for quantity
        if (quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        // More robust way to find the existing item with null checks
        const existingItem = user.cartItems.find((item) => {
            if (!item || !item.product) {
                console.log("Found cart item with undefined product:", item);
                return false;
            }
            return item.product.toString() === productId;
        });

        if (existingItem) {
            if (quantity === 0) {
                // Remove item from cart
                user.cartItems = user.cartItems.filter((item) => {
                    if (!item || !item.product) {
                        return false; // Remove invalid items
                    }
                    return item.product.toString() !== productId;
                });
                await user.save();
                return res.json(user.cartItems);
            }
            
            // Update quantity
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            console.log("Item not found in cart. Cart items:", user.cartItems);
            console.log("Looking for productId:", productId);
            res.status(404).json({message:"Item not found in cart"});
        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        console.log("Full error:", error);
        res.status(500).json({ message: "server error", error: error.message });
    }
}