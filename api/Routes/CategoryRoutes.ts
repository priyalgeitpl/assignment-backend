// productRoutes.js
import express from 'express';
const router = express.Router();
import { generateCategories, getCategory, saveCategories } from '../Controllers/CategoryController';

router.get('/generatecategories', generateCategories);
router.get('/categories', getCategory);
router.post('/categories', saveCategories);

export default router;
