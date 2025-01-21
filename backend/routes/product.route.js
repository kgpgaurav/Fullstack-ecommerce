import express from 'express';
import { createProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct, deleteProduct } from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middelware/auth.middleware.js';

const router = express.Router();

router.get("/",protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/",protectRoute, adminRoute, createProduct);
router.put("/:id",protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id",protectRoute, adminRoute, deleteProduct);
export default router;