import React, { useState } from 'react';
import { QrCode, Copy, Check, Download, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface QRCodeDisplayProps {
  qrCode: string;
  productName: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

interface QRCodeModalProps {
  qrCode: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Simple QR Code placeholder component - replace with actual QR library later
const QRCodePlaceholder: React.FC<{ value: string; size: number }> = ({ value, size }) => {
  return (
    <div 
      className="bg-white border-2 border-gray-300 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="text-center p-2">
        <QrCode className="w-8 h-8 mx-auto mb-1 text-gray-600" />
        <div className="text-xs font-mono break-all leading-tight text-gray-800">
          {value.substring(0, 16)}...
        </div>
      </div>
    </div>
  );
};

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  qrCode, 
  productName, 
  size = 100, 
  showLabel = true,
  className = ""
}) => {
  const [showModal, setShowModal] = useState(false);
  
  if (!qrCode) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`} style={{ width: size, height: size }}>
        <QrCode className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div 
        className="bg-white p-2 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowModal(true)}
      >
        <QRCodePlaceholder value={qrCode} size={size} />
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-medium text-foreground">{productName}</p>
          <p className="text-xs text-muted-foreground">{qrCode}</p>
        </div>
      )}
      
      <QRCodeModal 
        qrCode={qrCode}
        productName={productName}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  qrCode, 
  productName, 
  isOpen, 
  onClose 
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "QR code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    // Create a simple text file with QR code for now
    const blob = new Blob([`Product: ${productName}\nQR Code: ${qrCode}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-${productName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "QR code info saved to downloads",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Product QR Code
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{productName}</h3>
            <Badge variant="outline" className="text-xs">
              {qrCode}
            </Badge>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border">
              <QRCodePlaceholder value={qrCode} size={200} />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={downloadQR}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Scan this QR code to verify product authenticity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const QRCodeButton: React.FC<{ qrCode: string; productName: string }> = ({ 
  qrCode, 
  productName 
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!qrCode) {
    return (
      <Button variant="outline" size="sm" disabled>
        <QrCode className="w-4 h-4 mr-2" />
        No QR Code
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowModal(true)}
      >
        <Eye className="w-4 h-4 mr-2" />
        View QR
      </Button>
      
      <QRCodeModal 
        qrCode={qrCode}
        productName={productName}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};