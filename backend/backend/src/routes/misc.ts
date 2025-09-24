import express from 'express';
import { placeholderImage } from '../controllers/qrController.js';

const { Router } = express;

const router = Router();

router.get('/placeholder/:w/:h', placeholderImage);

export default router;


