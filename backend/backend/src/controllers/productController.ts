import express from 'express';
import Product from '../models/Product.js';
import type { AuthRequest } from '../middleware/auth.js';

type Request = express.Request;
type Response = express.Response;

export async function createProduct(req: AuthRequest, res: Response) {
  const { name, quantity, pricePerKg, harvestDate, description } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const qrCode = `QR_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const product = await Product.create({
    name,
    quantity,
    pricePerKg,
    harvestDate,
    description,
    status: 'pending',
    validatorsApproved: 0,
    totalValidators: 5,
    farmer: req.user.id,
    qrCode,
  });
  res.status(201).json(product);
}

export async function listProducts(_req: Request, res: Response) {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
}

export async function voteProduct(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { decision, reason } = req.body as { decision: 'approve' | 'reject'; reason?: string };
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  if (decision === 'approve') {
    product.validatorsApproved += 1;
    if (product.validatorsApproved >= product.totalValidators) product.status = 'approved';
  } else {
    product.status = 'rejected';
    product.rejectionReason = reason || 'Rejected by validator';
  }
  await product.save();
  res.json(product);
}

export async function getProductByQr(req: Request, res: Response) {
  const { code } = req.params;
  const product = await Product.findOne({ qrCode: code }).populate('farmer', 'name');
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
}


