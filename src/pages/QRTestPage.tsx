import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ProductResult {
  _id: string;
  name: string;
  status: string;
  pricePerKg: number;
  quantity: number;
  qrCode: string;
}

const QRTestPage: React.FC = () => {
  const [qrCode, setQrCode] = useState('QR_1759063926821_9mwuwc');
  const [result, setResult] = useState<ProductResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testQRLookup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing QR lookup for:', qrCode);
      const response = await fetch(`http://localhost:4000/api/products/qr/${qrCode}`);
      
      if (response.ok) {
        const product = await response.json();
        console.log('Product found:', product);
        setResult(product);
      } else {
        const errorData = await response.text();
        console.error('QR lookup failed:', response.status, errorData);
        setError(`Failed to find product: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const openProductPage = () => {
    if (result) {
      const url = `/product/${qrCode}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Lookup Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">QR Code:</label>
            <Input
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Enter QR code to test"
            />
          </div>
          
          <Button onClick={testQRLookup} disabled={loading} className="w-full">
            {loading ? 'Testing...' : 'Test QR Lookup'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-medium text-red-800 mb-2">Error:</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-medium text-green-800 mb-2">Product Found:</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Name:</strong> {result.name}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Price:</strong> ₹{result.pricePerKg}/kg</p>
                <p><strong>Quantity:</strong> {result.quantity}kg</p>
                <p><strong>QR Code:</strong> {result.qrCode}</p>
                <p><strong>Product ID:</strong> {result._id}</p>
              </div>
              <Button onClick={openProductPage} className="mt-3">
                Open Product Page
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p><strong>Direct URL:</strong> <code>http://localhost:5173/product/{qrCode}</code></p>
            <p><strong>API Endpoint:</strong> <code>http://localhost:4000/api/products/qr/{qrCode}</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRTestPage;