import express from 'express';
import { getProductByQr } from './productController.js';

type Request = express.Request;
type Response = express.Response;

export async function lookupByCode(req: Request, res: Response) {
  // Delegate to product lookup
  return getProductByQr(req, res);
}

export async function placeholderImage(req: Request, res: Response) {
  const { w = '300', h = '200' } = req.params as any;
  const width = Number(w);
  const height = Number(h);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <rect width='100%' height='100%' fill='#e5e7eb'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial' font-size='16'>${width}x${height}</text>
  </svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
}


