import express from 'express';
import { getAllProducts, getFeaturedProducts } from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middelware/auth.middleware.js';

const router = express.Router();

router.get("/",protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/",protectRoute, adminRoute, createProduct);

export default router;