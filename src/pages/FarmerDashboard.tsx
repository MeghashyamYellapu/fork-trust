import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  BarChart3, 
  History, 
  LogOut,
  Camera,
  Calendar,
  MapPin,
  DollarSign,
  Package,
  RefreshCw,
  AlertCircle,
  Thermometer,
  Droplet,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch, getRole } from '@/lib/api';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Product {
  id: string;
  name: string;
  quantity: number;
  pricePerKg: number;
  harvestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  validatorsApproved: number;
  totalValidators: number;
  rejectionReason?: string;
  revenue?: number;
}

interface ProductForm {
  name: string;
  quantity: string;
  price: string;
  harvestDate: string;
  description: string;
  category: string;
  expiryDate: string;
  batchNumber: string;
  iotSensorData: {
    temperature: number;
    humidity: number;
    lastUpdated: string;
  };
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  organicType: string;
  farmLocation: string;
  packagingDate: string;
}

const FarmerDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Generate IoT sensor data
  const generateIoTData = () => ({
    temperature: Math.round(Math.random() * (33 - 18) + 18), // 18-33°C
    humidity: Math.round(Math.random() * (80 - 40) + 40), // 40-80%
    lastUpdated: new Date().toISOString()
  });

  // Generate GPS coordinates (Indian agricultural belt)
  const generateGPSCoordinates = () => ({
    latitude: Math.round((Math.random() * (28 - 20) + 20) * 1000000) / 1000000, // 20-28°N
    longitude: Math.round((Math.random() * (87 - 77) + 77) * 1000000) / 1000000  // 77-87°E
  });

  // Generate batch number
  const generateBatchNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BTH${year}${month}${random}`;
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'add-product' | 'pending' | 'pricing' | 'history'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedState, setSelectedState] = useState('ODISHA');
  const { marketPrices, loading: pricesLoading, error: pricesError, refreshPrices, lastUpdated, changeState } = useMarketPrices(selectedState);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    quantity: '',
    price: '',
    harvestDate: '',
    description: '',
    category: '',
    expiryDate: '',
    batchNumber: generateBatchNumber(),
    iotSensorData: generateIoTData(),
    gpsCoordinates: generateGPSCoordinates(),
    organicType: '',
    farmLocation: '',
    packagingDate: '',
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Organic Rice',
      quantity: 500,
      pricePerKg: 45,
      harvestDate: '2024-01-15',
      status: 'approved',
      validatorsApproved: 5,
      totalValidators: 5,
      revenue: 22500,
    },
    {
      id: '2',
      name: 'Fresh Tomatoes',
      quantity: 200,
      pricePerKg: 30,
      harvestDate: '2024-01-20',
      status: 'pending',
      validatorsApproved: 3,
      totalValidators: 5,
    },
    {
      id: '3',
      name: 'Wheat',
      quantity: 300,
      pricePerKg: 25,
      harvestDate: '2024-01-10',
      status: 'rejected',
      validatorsApproved: 1,
      totalValidators: 5,
      rejectionReason: 'Quality concerns - moisture content too high',
    },
  ]);

  const handleStateChange = async (newState: string) => {
    setSelectedState(newState);
    await changeState(newState);
  };

  // Mock IoT and GPS data generator
  const generateMockData = () => {
    // Mock GPS coordinates for agricultural regions in India
    const mockGPS = {
      latitude: (20.0 + Math.random() * 8).toFixed(6), // Between 20-28°N (India's agricultural belt)
      longitude: (77.0 + Math.random() * 10).toFixed(6), // Between 77-87°E
    };
    
    // Mock IoT sensor data
    const mockIoT = {
      temperature: (18 + Math.random() * 15).toFixed(1), // 18-33°C
      humidity: (40 + Math.random() * 40).toFixed(1), // 40-80%
    };

    return { mockGPS, mockIoT };
  };

  React.useEffect(() => {
    // Auto-populate GPS and IoT data when component mounts
    const { mockGPS, mockIoT } = generateMockData();
    setProductForm(prev => ({
      ...prev,
      gpsLatitude: mockGPS.latitude,
      gpsLongitude: mockGPS.longitude,
      temperature: mockIoT.temperature,
      humidity: mockIoT.humidity,
      batchNumber: `BATCH-${Date.now().toString().slice(-8)}`, // Auto-generate batch number
    }));
  }, []);

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const refreshIoTData = () => {
    setProductForm(prev => ({
      ...prev,
      iotSensorData: generateIoTData()
    }));
  };

  const refreshGPSCoordinates = () => {
    setProductForm(prev => ({
      ...prev,
      gpsCoordinates: generateGPSCoordinates()
    }));
  };

  // Mock AI Analysis function
  const analyzeImageWithAI = async (imageFile: File) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // Mock AI analysis based on common agricultural products
      const mockAnalysisResults = [
        {
          name: 'Fresh Tomatoes',
          category: 'vegetable',
          description: 'Red ripe tomatoes with good color and firmness. Appears to be medium-sized variety with minimal blemishes.',
          estimatedQuantity: '50 kg',
          estimatedPrice: '35',
          quality: 'Grade A',
          organicType: 'natural',
          shelfLife: 7
        },
        // {
        //   name: 'Basmati Rice',
        //   category: 'grain',
        //   description: 'Long grain basmati rice with characteristic aroma. Well-dried and properly stored grains.',
        //   estimatedQuantity: '100 kg',
        //   estimatedPrice: '120',
        //   quality: 'Premium',
        //   organicType: 'conventional',
        //   shelfLife: 365
        // },
        // {
        //   name: 'Fresh Carrots',
        //   category: 'vegetable',
        //   description: 'Orange carrots with good shape and size. Fresh appearance with minimal soil residue.',
        //   estimatedQuantity: '25 kg',
        //   estimatedPrice: '40',
        //   quality: 'Grade A',
        //   organicType: 'certified-organic',
        //   shelfLife: 30
        // },
        // {
        //   name: 'Wheat Grains',
        //   category: 'grain',
        //   description: 'Golden wheat grains with uniform size and color. Well-threshed and clean grains.',
        //   estimatedQuantity: '200 kg',
        //   estimatedPrice: '25',
        //   quality: 'Standard',
        //   organicType: 'conventional',
        //   shelfLife: 180
        // },
        {
          name: 'Fresh Apples',
          category: 'fruit',
          description: 'Red and green apples with shiny skin. Good size and firmness indicating freshness.',
          estimatedQuantity: '30 kg',
          estimatedPrice: '80',
          quality: 'Premium',
          organicType: 'natural',
          shelfLife: 45
        }
      ];

      // Randomly select one of the mock results
      const selectedResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
      
      // Calculate expiry date based on shelf life
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + selectedResult.shelfLife);
      
      // Update form with AI-detected values
      setProductForm(prev => ({
        ...prev,
        name: selectedResult.name,
        category: selectedResult.category,
        description: selectedResult.description,
        quantity: selectedResult.estimatedQuantity,
        price: selectedResult.estimatedPrice,
        organicType: selectedResult.organicType,
        expiryDate: expiryDate.toISOString().split('T')[0],
        // Refresh IoT and GPS data for new product
        iotSensorData: generateIoTData(),
        gpsCoordinates: generateGPSCoordinates(),
        batchNumber: generateBatchNumber(),
      }));

      setAnalysisResults(`AI Analysis Complete! Detected: ${selectedResult.name} (${selectedResult.quality})`);
      
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAnalysisResults('AI analysis failed. Please fill in details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    setUploadedImages(prev => [...prev, ...newImages]);

    // Analyze the first uploaded image with AI
    if (newImages.length > 0) {
      await analyzeImageWithAI(newImages[0]);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const role = getRole();
      if (role !== 'farmer') return;
      const created = await apiFetch<any>('/products', {
        method: 'POST',
        auth: true,
        body: {
          name: productForm.name || 'unknown',
          quantity: Number(productForm.quantity || 0),
          pricePerKg: Number(productForm.price || 0),
          harvestDate: productForm.harvestDate,
          description: productForm.description,
        },
      });
      setProducts(prev => [{
        id: created._id,
        name: created.name,
        quantity: created.quantity,
        pricePerKg: created.pricePerKg,
        harvestDate: created.harvestDate,
        status: created.status,
        validatorsApproved: created.validatorsApproved,
        totalValidators: created.totalValidators,
      }, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setShowAddProduct(false);
      const { mockGPS, mockIoT } = generateMockData();
      setProductForm({ 
        name: '', 
        quantity: '', 
        price: '', 
        harvestDate: '', 
        description: '', 
        category: '',
        expiryDate: '',
        batchNumber: generateBatchNumber(),
        iotSensorData: generateIoTData(),
        gpsCoordinates: generateGPSCoordinates(),
        organicType: '',
        farmLocation: '',
        packagingDate: '',
      });
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const list = await apiFetch<any[]>('/products');
        setProducts(list.map(p => ({
          id: p._id,
          name: p.name,
          quantity: p.quantity,
          pricePerKg: p.pricePerKg,
          harvestDate: p.harvestDate,
          status: p.status,
          validatorsApproved: p.validatorsApproved,
          totalValidators: p.totalValidators,
          rejectionReason: p.rejectionReason,
        })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'approved': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-white';
      case 'rejected': return 'bg-error text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'approved': return t('statusApproved');
      case 'pending': return t('statusPendingReview');
      case 'rejected': return t('statusRejected');
      default: return t('statusUnknown');
    }
  };

  const totalRevenue = products.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.revenue || 0), 0);
  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const approvedProducts = products.filter(p => p.status === 'approved').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">{t('farmerDashboard')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: t('overview'), icon: BarChart3 },
            { id: 'add-product', label: t('addProduct'), icon: Plus },
            { id: 'pending', label: t('pendingApprovals'), icon: Clock },
            { id: 'pricing', label: t('marketPrices'), icon: TrendingUp },
            { id: 'history', label: t('history'), icon: History },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalRevenue')}</p>
                <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card> */}

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('pendingApproval')}</p>
                <p className="text-2xl font-bold text-foreground">{pendingProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('approvedProducts')}</p>
                <p className="text-2xl font-bold text-foreground">{approvedProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalProducts')}</p>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
              </div>
            </div>
          </Card>
        </div>

        

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold mb-4">{t('recentProducts')}</h3>
              <div className="space-y-3">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} kg</p>
                    </div>
                    <Badge className={getStatusColor(product.status)}>
                      {getStatusText(product.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setActiveTab('add-product')}
                  className="w-full btn-primary justify-start"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('addNewProduct')}
                </Button>
                <Button 
                  onClick={() => setActiveTab('pending')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  {t('viewPendingApprovals')}
                </Button>
                <Button 
                  onClick={() => setActiveTab('pricing')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {t('checkMarketPrices')}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'add-product' && (
          <Card className="card-elevated p-4 sm:p-6 w-full max-w-none lg:max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-6">{t('addNewProductTitle')}</h3>
            <form onSubmit={handleSubmitProduct} className="space-y-4 sm:space-y-6">
              {/* Product Images Upload */}
              <div>
                <Label className="text-base sm:text-lg">
                  {language === 'en' ? 'Product Images' : 'उत्पाद की तस्वीरें'} *
                </Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isAnalyzing}
                  />
                  
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
                      <p className="text-blue-600 font-medium text-sm sm:text-base text-center">
                        {language === 'en' ? 'AI Analyzing Image...' : 'AI तस्वीर का विश्लेषण कर रहा है...'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
                        {language === 'en' ? 'Detecting product details automatically' : 'उत्पाद विवरण स्वचालित रूप से पहचाना जा रहा है'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base text-center px-2">
                        {language === 'en' ? 'Click to upload product images - AI will auto-detect details!' : 'उत्पाद की तस्वीरें अपलोड करें - AI स्वतः विवरण पहचानेगा!'}
                      </p>
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" className="mb-2 text-sm sm:text-base" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Choose Images' : 'तस्वीरें चुनें'}
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 text-center">
                        {language === 'en' ? 'PNG, JPG, GIF up to 10MB each' : 'PNG, JPG, GIF प्रत्येक 10MB तक'}
                      </p>
                    </>
                  )}
                </div>

                {/* Analysis Results */}
                {analysisResults && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-800 font-medium text-sm sm:text-base">{analysisResults}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      {language === 'en' ? 'Form fields updated automatically. You can modify them if needed.' : 'फॉर्म फील्ड स्वचालित रूप से अपडेट हो गए। आवश्यकता अनुसार आप इन्हें संशोधित कर सकते हैं।'}
                    </p>
                    {/* Preview Product Details Button */}
                    <div className="mt-3">
                      <Button
                        type="button"
                        onClick={() => {
                          // Generate a mock product ID based on current form data
                          const mockId = `mock-${productForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
                          navigate(`/product/${mockId}`);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-300 hover:bg-green-50 w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Preview Product Details' : 'उत्पाद विवरण देखें'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'en' ? 'Uploaded Images:' : 'अपलोड की गई तस्वीरें:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 p-0 rounded-full"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                          >
                            <XCircle size={12} className="sm:hidden" />
                            <XCircle size={14} className="hidden sm:block" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Product Name */}
                    <div>
                      <Label htmlFor="name" className="text-base sm:text-lg">
                        {language === 'en' ? 'Product Name' : 'उत्पाद का नाम'} *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={productForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={language === 'en' ? 'Enter product name' : 'उत्पाद का नाम दर्ज करें'}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <Label htmlFor="quantity" className="text-base sm:text-lg">
                        {language === 'en' ? 'Quantity' : 'मात्रा'} *
                      </Label>
                      <Input
                        id="quantity"
                        type="text"
                        value={productForm.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder={language === 'en' ? 'e.g., 100 kg, 50 units' : 'उदाहरण: 100 किलो, 50 यूनिट'}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <Label htmlFor="price" className="text-base sm:text-lg">
                        {language === 'en' ? 'Price (₹)' : 'कीमत (₹)'} *
                      </Label>
                      <Input
                        id="price"
                        type="text"
                        value={productForm.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder={language === 'en' ? 'Enter price per unit' : 'प्रति यूनिट कीमत दर्ज करें'}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <Label htmlFor="category" className="text-base sm:text-lg">
                        {language === 'en' ? 'Category' : 'श्रेणी'} *
                      </Label>
                      <Select  value={productForm.category} onValueChange={(value) => handleInputChange('category', value)} required>
                        <SelectTrigger className="mt-2 text-base sm:text-lg h-12 sm:h-14 bg-green-50 border-green-300 hover:bg-green-100 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder={language === 'en' ? 'Select Category' : 'श्रेणी चुनें'} />
                        </SelectTrigger>
                        <SelectContent className="bg-green-50 border-green-300">
                          <SelectItem value="fruit" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Fruit' : 'फल'}</SelectItem>
                          <SelectItem value="vegetable" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Vegetable' : 'सब्जी'}</SelectItem>
                          <SelectItem value="grain" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Grain' : 'अनाज'}</SelectItem>
                          <SelectItem value="pulse" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Pulse' : 'दाल'}</SelectItem>
                          <SelectItem value="spice" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Spice' : 'मसाला'}</SelectItem>
                          <SelectItem value="oilseed" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Oil Seed' : 'तेल बीज'}</SelectItem>
                          <SelectItem value="fiber" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Fiber' : 'फाइबर'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <Label htmlFor="expiryDate" className="text-base sm:text-lg">
                        {language === 'en' ? 'Expiry / Best Before Date' : 'समाप्ति दिनांक'}
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={productForm.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                      />
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {language === 'en' ? 'For perishable goods' : 'नष्ट होने वाली वस्तुओं के लिए'}
                      </p>
                    </div>

                    {/* Batch Number (Auto-generated) */}
                    <div>
                      <Label htmlFor="batchNumber" className="text-base sm:text-lg">
                        {language === 'en' ? 'Batch Number' : 'बैच संख्या'}
                      </Label>
                      <Input
                        id="batchNumber"
                        type="text"
                        value={productForm.batchNumber}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14 bg-gray-100"
                        readOnly
                      />
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {language === 'en' ? 'Auto-generated for tracking' : 'ट्रैकिंग के लिए स्वतः उत्पन्न'}
                      </p>
                    </div>

                    {/* IoT Sensor Data Display */}
                    <div>
                      <Label className="text-base sm:text-lg">
                        {language === 'en' ? 'IoT Sensor Data' : 'IoT सेंसर डेटा'}
                      </Label>
                      <div className="mt-2 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 font-medium text-xs sm:text-sm">
                            {language === 'en' ? 'Live from IoT devices' : 'IoT उपकरणों से लाइव'}
                          </span>
                          <Button
                            type="button"
                            onClick={refreshIoTData}
                            size="sm"
                            variant="outline"
                            className="ml-auto p-1 sm:p-2"
                          >
                            <RefreshCw size={12} className="sm:hidden" />
                            <RefreshCw size={14} className="hidden sm:block" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="flex items-center gap-1 sm:gap-2 p-2 bg-white rounded border">
                            <Thermometer className="text-red-500" size={14} />
                            <div>
                              <p className="text-xs text-gray-600">{language === 'en' ? 'Temp' : 'तापमान'}</p>
                              <p className="font-semibold text-xs sm:text-sm">{productForm.iotSensorData.temperature}°C</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 sm:gap-2 p-2 bg-white rounded border">
                            <Droplet className="text-blue-500" size={14} />
                            <div>
                              <p className="text-xs text-gray-600">{language === 'en' ? 'Humidity' : 'आर्द्रता'}</p>
                              <p className="font-semibold text-xs sm:text-sm">{productForm.iotSensorData.humidity}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GPS Coordinates Display */}
                    <div>
                      <Label className="text-base sm:text-lg">
                        {language === 'en' ? 'GPS Coordinates' : 'GPS निर्देशांक'}
                      </Label>
                      <div className="mt-2 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="text-blue-600" size={14} />
                          <span className="text-blue-700 font-medium text-xs sm:text-sm">
                            {language === 'en' ? 'Farm location' : 'खेत स्थान'}
                          </span>
                          <Button
                            type="button"
                            onClick={refreshGPSCoordinates}
                            size="sm"
                            variant="outline"
                            className="ml-auto p-1 sm:p-2"
                          >
                            <RefreshCw size={12} className="sm:hidden" />
                            <RefreshCw size={14} className="hidden sm:block" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="p-2 bg-white rounded border">
                            <p className="text-xs text-gray-600">{language === 'en' ? 'Latitude' : 'अक्षांश'}</p>
                            <p className="font-semibold text-xs sm:text-sm">{productForm.gpsCoordinates.latitude}°N</p>
                          </div>
                          
                          <div className="p-2 bg-white rounded border">
                            <p className="text-xs text-gray-600">{language === 'en' ? 'Longitude' : 'देशांतर'}</p>
                            <p className="font-semibold text-xs sm:text-sm">{productForm.gpsCoordinates.longitude}°E</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Organic Type */}
                    <div>
                      <Label htmlFor="organicType" className="text-base sm:text-lg">
                        {language === 'en' ? 'Organic Status' : 'जैविक स्थिति'}
                      </Label>
                      <Select value={productForm.organicType} onValueChange={(value) => handleInputChange('organicType', value)}>
                        <SelectTrigger className="mt-2 text-base sm:text-lg h-12 sm:h-14 bg-green-50 border-green-300 hover:bg-green-100 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder={language === 'en' ? 'Select Organic Type' : 'जैविक प्रकार चुनें'} />
                        </SelectTrigger>
                        <SelectContent className="bg-green-50 border-green-300">
                          <SelectItem value="certified-organic" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Certified Organic' : 'प्रमाणित जैविक'}</SelectItem>
                          <SelectItem value="natural" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Natural' : 'प्राकृतिक'}</SelectItem>
                          <SelectItem value="conventional" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Conventional' : 'पारंपरिक'}</SelectItem>
                          <SelectItem value="transitional" className="hover:bg-green-100 focus:bg-green-200">{language === 'en' ? 'Transitional' : 'संक्रमणकालीन'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Harvest Date */}
                    <div>
                      <Label htmlFor="harvestDate" className="text-base sm:text-lg">
                        {language === 'en' ? 'Harvest Date' : 'फसल की तारीख'}
                      </Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        value={productForm.harvestDate}
                        onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                      />
                    </div>

                    {/* Farm Location */}
                    <div>
                      <Label htmlFor="farmLocation" className="text-base sm:text-lg">
                        {language === 'en' ? 'Farm Location' : 'खेत का स्थान'}
                      </Label>
                      <Input
                        id="farmLocation"
                        type="text"
                        value={productForm.farmLocation}
                        onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                        placeholder={language === 'en' ? 'Enter farm location' : 'खेत का स्थान दर्ज करें'}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                      />
                    </div>

                    {/* Packaging Date */}
                    <div>
                      <Label htmlFor="packagingDate" className="text-base sm:text-lg">
                        {language === 'en' ? 'Packaging Date' : 'पैकेजिंग की तारीख'}
                      </Label>
                      <Input
                        id="packagingDate"
                        type="date"
                        value={productForm.packagingDate}
                        onChange={(e) => handleInputChange('packagingDate', e.target.value)}
                        className="mt-2 text-base sm:text-lg h-12 sm:h-14"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-base sm:text-lg">
                      {language === 'en' ? 'Description' : 'विवरण'}
                    </Label>
                    <Textarea
                      id="description"
                      value={productForm.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder={language === 'en' ? 'Enter product description (optional)' : 'उत्पाद विवरण दर्ज करें (वैकल्पिक)'}
                      className="mt-2 text-base sm:text-lg min-h-[80px] sm:min-h-[100px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full text-base sm:text-lg py-3 sm:py-4 bg-green-600 hover:bg-green-700 h-12 sm:h-16"
                    size="lg"
                  >
                    <Upload className="mr-2" size={18} />
                    {language === 'en' ? 'Submit for Validation' : 'सत्यापन के लिए जमा करें'}
                  </Button>
            </form>
          </Card>
        )}

        {activeTab === 'pending' && (
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">{t('pendingApprovals')}</h3>
              <p className="text-muted-foreground">{t('productsAwaitingApproval')}</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {products.filter(p => p.status === 'pending' || p.status === 'rejected').map((product) => (
                  <div key={product.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{product.name}</h4>
                        <p className="text-muted-foreground">
                          {product.quantity} kg • ₹{product.pricePerKg}/kg • {new Date(product.harvestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-full h-2 w-32">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(product.validatorsApproved / product.totalValidators) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.validatorsApproved}/{product.totalValidators} {t('validatorsLabel')}
                        </span>
                      </div>
                    </div>

                    {product.status === 'rejected' && product.rejectionReason && (
                      <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                        <p className="text-sm text-error font-medium mb-1">{t('rejectionReasonLabel')}</p>
                        <p className="text-sm text-error">{product.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'pricing' && (
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{t('marketPriceDashboard')}</h3>
                  <p className="text-muted-foreground">{t('fairPricingRecommendations')}</p>
                  {lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {lastUpdated.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ODISHA">Odisha</SelectItem>
                      <SelectItem value="PUNJAB">Punjab</SelectItem>
                      <SelectItem value="HARYANA">Haryana</SelectItem>
                      <SelectItem value="KARNATAKA">Karnataka</SelectItem>
                      <SelectItem value="GUJARAT">Gujarat</SelectItem>
                      <SelectItem value="MAHARASHTRA">Maharashtra</SelectItem>
                      <SelectItem value="UTTAR PRADESH">Uttar Pradesh</SelectItem>
                      <SelectItem value="BIHAR">Bihar</SelectItem>
                      <SelectItem value="RAJASTHAN">Rajasthan</SelectItem>
                      <SelectItem value="MADHYA PRADESH">Madhya Pradesh</SelectItem>
                      <SelectItem value="WEST BENGAL">West Bengal</SelectItem>
                      <SelectItem value="TAMIL NADU">Tamil Nadu</SelectItem>
                      <SelectItem value="ANDHRA PRADESH">Andhra Pradesh</SelectItem>
                      <SelectItem value="TELANGANA">Telangana</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={refreshPrices}
                    variant="outline"
                    className="gap-2"
                    disabled={pricesLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${pricesLoading ? 'animate-spin' : ''}`} />
                    {pricesLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
              </div>
              
              {pricesError && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {pricesError}. Showing cached data or fallback prices for {selectedState}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="p-6">
              {pricesLoading && marketPrices.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 animate-pulse">
                      <div className="h-6 bg-muted rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-800 font-medium">
                      📍 Market Prices for {selectedState} - Updated from eNAM Portal
                    </p>
                    <p className="text-blue-600 text-sm">
                      Showing live agricultural commodity prices from mandis across {selectedState}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketPrices.map((price, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-lg">{price.crop}</h4>
                          <div className={`flex items-center gap-1 ${
                            price.trend === 'up' ? 'text-success' : 
                            price.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                          }`}>
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium capitalize">{price.trend}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('marketPrice')}</span>
                            <span className="font-medium">₹{price.currentPrice}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('recommended')}</span>
                            <span className="text-primary font-semibold">₹{price.recommendedPrice}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price Range</span>
                            <span className="font-medium">₹{price.minPrice}-{price.maxPrice}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('profitMargin')}</span>
                            <span className="font-medium text-success">
                              +₹{price.recommendedPrice - price.currentPrice}/kg
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Arrivals</span>
                            <span className="font-medium">{price.arrivals}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Market</span>
                            <span className="font-medium">{price.market}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location</span>
                            <span className="font-medium">{price.district}, {price.state}</span>
                          </div>
                          {price.variety && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Variety</span>
                              <span className="font-medium">{price.variety}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>
        )}        {activeTab === 'history' && (
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">{t('productHistory')}</h3>
              <p className="text-muted-foreground">{t('pastUploadsAndSales')}</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-lg">{product.name}</h4>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium">{product.quantity} kg</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">₹{product.pricePerKg}/kg</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Harvest Date:</span>
                        <p className="font-medium">{new Date(product.harvestDate).toLocaleDateString()}</p>
                      </div>
                      {product.revenue && (
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <p className="font-medium text-success">₹{product.revenue.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;