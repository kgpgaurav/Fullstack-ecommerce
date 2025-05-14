import express from 'express';
import { createProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct, deleteProduct } from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/",protectRoute, adminRoute, getAllProducts); //only admins can check all products
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);

//products can be only post or deleted or edit by the admin
router.post("/",protectRoute, adminRoute, createProduct);
router.put("/:id",protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id",protectRoute, adminRoute, deleteProduct);

export default router;