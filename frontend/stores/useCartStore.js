import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast';

export const useCartStore = create((set, get) => ({

    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,


    getMyCoupon: async () => {
        try {
            const response = await axios.get("/coupons");
            set({ coupon: response.data });
        } catch (error) {
            // Don't log error for 404 - just silently fail
            if (error.response?.status !== 404) {
                console.error("Error fetching coupon:", error);
            }
            set({ coupon: null });
        }
    },
    applyCoupon: async (code) => {
        try {
            const response = await axios.post("/coupons/validate", { code });
            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
        }
    },
    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
    },

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            console.log("Cart data from API:", res.data); // Debug log
            set({ cart: res.data || [] });
            get().calculateTotals();
        } catch (error) {
            console.error("Error fetching cart items:", error);
            set({ cart: [] });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },
    clearCart: async () => {
        try {
            // Clear cart on backend
            await axios.delete("/cart");
            // Clear cart in store
            set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
        } catch (error) {
            console.error("Error clearing cart:", error);
            // Still clear local cart even if backend fails
            set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
        }
    },
    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                      )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },
    
    removeFromCart: async (productId) => {
        try {
            await axios.delete("/cart", { data: { productId } });
            set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
            get().calculateTotals();
        } catch (error) {
			console.error("Error removing item from cart:", error);
            toast.error(error.response?.data?.message || "Error removing item from cart");
        }
    },
    updateQuantity: async (productId, quantity) => {
        try {
            // Call the backend updateQuantity endpoint
            await axios.put(`/cart/${productId}`, { quantity });
            
            if (quantity === 0) {
                // Remove item from local state when quantity becomes 0
                set((prevState) => ({
                    cart: prevState.cart.filter((item) => item._id !== productId)
                }));
                toast.success("Item removed from cart");
            } else {
                // Update quantity in local state
                set((prevState) => ({
                    cart: prevState.cart.map((item) => 
                        item._id === productId ? { ...item, quantity } : item
                    )
                }));
            }
            
            get().calculateTotals();
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error(error.response?.data?.message || "Error updating quantity");
        }
    },
    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },
}));
