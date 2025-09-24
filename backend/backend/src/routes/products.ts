import express from 'express';
import { createProduct, listProducts, voteProduct } from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const { Router } = express;

const router = Router();

router.get('/', listProducts);
router.post('/', requireAuth, requireRole(['farmer']), createProduct);
router.post('/:id/vote', requireAuth, requireRole(['validator']), voteProduct);

export default router;


