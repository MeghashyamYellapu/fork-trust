import express from 'express';
import { lookupByCode } from '../controllers/qrController.js';

const { Router } = express;

const router = Router();

router.get('/:code', lookupByCode);

export default router;


