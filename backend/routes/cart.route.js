import express from 'express';
import { protectRoute } from '../middelware/auth.middleware';

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/", protectRoute, updateQunatity);

export default router;