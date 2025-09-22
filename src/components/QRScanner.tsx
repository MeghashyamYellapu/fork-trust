import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Scan } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const { t } = useLanguage();
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock QR scanning - replace with actual implementation
  const startCameraScanning = async () => {
    try {
      setIsScanning(true);
      setScanMode('camera');
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Mock successful scan after 3 seconds
      setTimeout(() => {
        onScan('MOCK_QR_CODE_12345');
        stopScanning();
      }, 3000);

    } catch (error) {
      console.error('Camera access denied:', error);
      setIsScanning(false);
      setScanMode(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanMode('upload');
      setIsScanning(true);
      
      // Mock QR code detection from image
      setTimeout(() => {
        onScan('MOCK_QR_CODE_FROM_IMAGE_67890');
        setIsScanning(false);
        setScanMode(null);
      }, 2000);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setScanMode(null);
  };

  useEffect(() => {
    if (!isOpen) {
      stopScanning();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Scan className="icon-medium text-primary" />
              {t('scanProduct')}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-muted-foreground text-center mb-6">
            {t('scanInstructions')}
          </p>

          {!scanMode && !isScanning && (
            <div className="space-y-4">
              <Button
                onClick={startCameraScanning}
                className="w-full btn-primary"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                {t('useCamera')}
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                {t('uploadImage')}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-primary rounded-lg w-48 h-48 relative">
                      <div className="absolute inset-0 border-2 border-primary animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={stopScanning}
                variant="outline"
                className="w-full"
              >
                {t('close')}
              </Button>
            </div>
          )}

          {scanMode === 'upload' && isScanning && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing image...</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};