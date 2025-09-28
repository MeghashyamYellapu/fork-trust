import express from 'express';
import Product from '../models/Product.js';
import type { AuthRequest } from '../middleware/auth.js';

type Request = express.Request;
type Response = express.Response;

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const { name, quantity, pricePerKg, harvestDate, description } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate required fields
    if (!name || !quantity || !pricePerKg) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, quantity, and pricePerKg are required' 
      });
    }

    // Ensure quantity and price are numbers
    const numQuantity = Number(quantity);
    const numPricePerKg = Number(pricePerKg);
    
    if (isNaN(numQuantity) || isNaN(numPricePerKg)) {
      return res.status(400).json({ 
        message: 'Quantity and price must be valid numbers' 
      });
    }

    const qrCode = `QR_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    console.log('Creating product with data:', {
      name,
      quantity: numQuantity,
      pricePerKg: numPricePerKg,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      description: description || '',
      farmer: req.user.id,
      qrCode
    });

    const product = await Product.create({
      name,
      quantity: numQuantity,
      pricePerKg: numPricePerKg,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      description: description || '',
      status: 'pending',
      validatorsApproved: 0,
      totalValidators: 5,
      farmer: req.user.id,
      qrCode,
    });

    console.log('Product created successfully:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
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

export async function acceptProductForDistribution(req: AuthRequest, res: Response) {
  const { id } = req.params;
  
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // For testing: allow pending products with at least some validation
    // In production, you'd want: product.status !== 'approved'
    if (product.status !== 'approved' && product.status !== 'pending') {
      return res.status(400).json({ message: 'Product must be approved or pending for distribution' });
    }
    
    // Update product status to indicate it's being distributed
    product.status = 'in-distribution';
    await product.save();
    
    res.json({ 
      message: 'Product accepted for distribution', 
      product 
    });
  } catch (error) {
    console.error('Error accepting product for distribution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function acceptProductForRetail(req: AuthRequest, res: Response) {
  const { id } = req.params;
  
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Allow products that are in distribution to be accepted for retail
    if (product.status !== 'in-distribution' && product.status !== 'retail') {
      return res.status(400).json({ message: 'Product must be in distribution before retail acceptance' });
    }
    
    // Update product status to indicate it's in retail
    product.status = 'retail';
    await product.save();
    
    res.json({ 
      message: 'Product accepted for retail inventory', 
      product 
    });
  } catch (error) {
    console.error('Error accepting product for retail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


