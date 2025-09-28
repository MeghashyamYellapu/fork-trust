import express from 'express';
import { createProduct, listProducts, voteProduct, getProductByQr, acceptProductForDistribution, acceptProductForRetail } from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const { Router } = express;

const router = Router();

router.get('/', listProducts);
router.get('/qr/:code', getProductByQr);
router.post('/', requireAuth, requireRole(['producer', 'farmer']), createProduct);

// Debug endpoint to check authentication
router.get('/debug/auth', requireAuth, (req, res) => {
  res.json({ 
    authenticated: true, 
    user: req.user,
    message: 'Authentication successful' 
  });
});

router.post('/:id/vote', requireAuth, requireRole(['validator', 'quality-inspector']), voteProduct);
router.post('/:id/accept', requireAuth, requireRole(['distributor']), acceptProductForDistribution);
router.post('/:id/retail', requireAuth, requireRole(['retailer']), acceptProductForRetail);

export default router;


