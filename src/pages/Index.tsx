import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, Scale, CheckCircle, Upload, Shield, Smartphone, QrCode, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { QRScanner } from '@/components/QRScanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-farm.jpg';
import benefitsImage from '@/assets/benefits-icons.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleQRScan = (result: string) => {
    console.log('QR Code scanned:', result);
    // Navigate to product details page with mock data
    setShowQRScanner(false);
    // Generate mock product ID based on scanned result or use default
    const productId = result || 'mock-tomatoes-batch-001';
    navigate(`/product/${productId}`);
  };

  const benefits = [
    {
      icon: Eye,
      title: t('transparency'),
      description: t('transparencyDesc'),
    },
    {
      icon: Scale,
      title: t('fairPricing'),
      description: t('fairPricingDesc'),
    },
    {
      icon: CheckCircle,
      title: t('qualityTracking'),
      description: t('qualityTrackingDesc'),
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: t('step1'),
      description: t('step1Desc'),
      color: 'text-primary',
    },
    {
      icon: Shield,
      title: t('step2'),
      description: t('step2Desc'),
      color: 'text-info',
    },
    {
      icon: Leaf,
      title: t('step3'),
      description: t('step3Desc'),
      color: 'text-success',
    },
    {
      icon: Smartphone,
      title: t('step4'),
      description: t('step4Desc'),
      color: 'text-warning',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">FarmChain</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-hero text-foreground mb-6 max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>
          <p className="text-large text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')}
              className="btn-hero min-w-[200px]"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              {t('register')}
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              size="lg" 
              className="min-w-[200px] bg-background/80 backdrop-blur-sm"
            >
              {t('login')}
            </Button>
          </div>

          <div className="mt-12">
            <Button 
              onClick={() => setShowQRScanner(true)}
              variant="secondary"
              size="lg"
              className="bg-background/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
            >
              <QrCode className="w-6 h-6 mr-3" />
              {t('scanQR')}
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('aboutTitle')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-elevated text-center p-8 animate-fade-in hover:scale-105 transition-all duration-300">
                <benefit.icon className="icon-large text-primary mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('howItWorksTitle')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-farm rounded-full flex items-center justify-center mx-auto shadow-large">
                    <step.icon className={`w-10 h-10 text-white`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl">FarmChain</span>
              </div>
              <p className="text-muted mb-4 max-w-md">
                Empowering transparent, sustainable agriculture through blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted mt-8 pt-8 text-center text-muted">
            <p>&copy; 2024 FarmChain. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      <QRScanner 
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </div>
  );
};

export default Index;
