import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Package, User, Calendar, MapPin, CheckCircle, Star, Truck, Store, Eye, DollarSign, Clock, Shield, Leaf, Verified, Phone, Mail, IdCard, Award } from 'lucide-react';

interface ProductDetailProps {
  _id: string;
  name: string;
  quantity: number;
  pricePerKg: number;
  harvestDate: string;
  description?: string;
  status: string;
  validatorsApproved: number;
  totalValidators: number;
  imageUrl?: string;
  farmer: {
    _id: string;
    fullName?: string;
    name?: string;
    location?: string;
    phone?: string;
    email?: string;
    kycVerified?: boolean;
    farmArea?: string;
    experience?: number;
  };
  distributor?: {
    _id: string;
    fullName?: string;
    name?: string;
    location?: string;
    phone?: string;
    email?: string;
    distributionDate?: string;
    kycVerified?: boolean;
    licenseNumber?: string;
    companyName?: string;
  };
  retailer?: {
    _id: string;
    fullName?: string;
    name?: string;
    location?: string;
    phone?: string;
    email?: string;
    retailDate?: string;
    kycVerified?: boolean;
    storeType?: string;
    licenseNumber?: string;
  };
  validators?: Array<{
    _id: string;
    fullName?: string;
    name?: string;
    validatedAt?: string;
    rating?: number;
    notes?: string;
    kycVerified?: boolean;
    certificationLevel?: string;
  }>;
  qrCode?: string;
  createdAt: string;
  distributionPrice?: number;
  retailPrice?: number;
  finalPrice?: number;
  supplyChainSteps?: Array<{
    step: string;
    date: string;
    actor: string;
    price?: number;
    status: string;
  }>;
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<ProductDetailProps | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Get product data from navigation state
  const productFromState = location.state?.product as ProductDetailProps;

  const enhanceProductData = React.useCallback(async (baseProduct: ProductDetailProps): Promise<ProductDetailProps> => {
    // Demo names for supply chain actors
    const getDemoFarmerName = () => baseProduct.farmer.fullName || baseProduct.farmer.name || 'Rajesh Kumar (Farmer)';
    const getDemoDistributorName = () => baseProduct.distributor?.fullName || baseProduct.distributor?.name || 'Mumbai Fresh Logistics Pvt Ltd';
    const getDemoRetailerName = () => baseProduct.retailer?.fullName || baseProduct.retailer?.name || 'Green Valley Supermarket';
    
    // Create supply chain steps based on product status and data
    const supplyChainSteps = [
      {
        step: 'Harvest',
        date: baseProduct.harvestDate || baseProduct.createdAt,
        actor: getDemoFarmerName(),
        price: baseProduct.pricePerKg,
        status: 'completed'
      }
    ];

    // Add validation step if validators exist
    if (baseProduct.validatorsApproved > 0) {
      supplyChainSteps.push({
        step: 'Validation',
        date: baseProduct.createdAt,
        actor: `Dr. Priya Sharma & ${baseProduct.validatorsApproved - 1} Other Quality Inspectors`,
        price: 0, // No additional cost for validation
        status: 'completed'
      });
    }

    // Add distribution step if product has been distributed
    if (baseProduct.status === 'in-distribution' || baseProduct.status === 'retail') {
      supplyChainSteps.push({
        step: 'Distribution',
        date: baseProduct.distributor?.distributionDate || baseProduct.createdAt,
        actor: getDemoDistributorName(),
        price: baseProduct.distributionPrice || baseProduct.pricePerKg * 1.1, // 10% markup
        status: 'completed'
      });
    }

    // Add retail step if product is at retail
    if (baseProduct.status === 'retail') {
      supplyChainSteps.push({
        step: 'Retail',
        date: baseProduct.retailer?.retailDate || baseProduct.createdAt,
        actor: getDemoRetailerName(),
        price: baseProduct.retailPrice || (baseProduct.pricePerKg * 1.1 * 1.1), // 10% markup on distribution price
        status: 'completed'
      });
    }

    return {
      ...baseProduct,
      supplyChainSteps,
      distributionPrice: baseProduct.distributionPrice || baseProduct.pricePerKg * 1.1, // 10% markup
      retailPrice: baseProduct.retailPrice || (baseProduct.pricePerKg * 1.1 * 1.1), // 10% markup on distribution price
      finalPrice: baseProduct.finalPrice || (baseProduct.pricePerKg * 1.1 * 1.1), // Same as retail price
    };
  }, []);

  const fetchProductData = React.useCallback(async (identifier: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try QR code lookup
      let response = await fetch(`http://localhost:4000/api/products/qr/${identifier}`);
      
      if (!response.ok && response.status === 404) {
        // If QR lookup fails, try by product ID
        response = await fetch(`http://localhost:4000/api/products`);
        if (response.ok) {
          const products = await response.json();
          const foundProduct = products.find((p: ProductDetailProps) => p._id === identifier);
          if (foundProduct) {
            const enhancedProduct = await enhanceProductData(foundProduct);
            setProduct(enhancedProduct);
            setLoading(false);
            return;
          }
        }
        throw new Error('Product not found');
      }
      
      if (response.ok) {
        const productData = await response.json();
        const enhancedProduct = await enhanceProductData(productData);
        setProduct(enhancedProduct);
      } else {
        throw new Error('Failed to fetch product data');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [enhanceProductData]);

  React.useEffect(() => {
    const initializeProduct = async () => {
      if (productFromState) {
        const enhancedProduct = await enhanceProductData(productFromState);
        setProduct(enhancedProduct);
      } else if (productId) {
        await fetchProductData(productId);
      }
    };
    
    initializeProduct();
  }, [productId, productFromState, fetchProductData, enhanceProductData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Product...</h2>
            <p className="text-muted-foreground">Fetching product details for: {productId}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || `The product with identifier "${productId}" could not be found.`}
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-distribution': return 'bg-blue-100 text-blue-800';
      case 'retail': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'Harvest': return <Leaf className="w-4 h-4" />;
      case 'Validation': return <Shield className="w-4 h-4" />;
      case 'Distribution': return <Truck className="w-4 h-4" />;
      case 'Retail': return <Store className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getSupplyChainProgress = () => {
    const totalSteps = 4; // Harvest, Validation, Distribution, Retail
    const completedSteps = product.supplyChainSteps?.length || 1;
    return (completedSteps / totalSteps) * 100;
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 6) return phone;
    return phone.substring(0, 3) + '***' + phone.substring(phone.length - 2);
  };

  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return local.substring(0, 2) + '***@' + domain;
  };

  const getVerificationBadge = (isVerified?: boolean, type: string = 'KYC') => {
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Verified className="w-3 h-3 mr-1" />
          {type} Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-muted-foreground">
        <Clock className="w-3 h-3 mr-1" />
        Pending Verification
      </Badge>
    );
  };

  const getProductImage = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('tomato')) {
      return '/src/assets/Tomatoes.avif';
    } else if (name.includes('coconut')) {
      return '/src/assets/coconut.avif';
    } else if (name.includes('chilli') || name.includes('chili') || name.includes('pepper')) {
      return '/src/assets/redchillies.avif';
    }
    // Default fallback image
    return '/src/assets/hero-farm.jpg';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="gap-2 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(product.status)} text-sm px-3 py-1`}>
                {product.status.replace('-', ' ').toUpperCase()}
              </Badge>
              {product.qrCode && (
                <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="w-3 h-3" />
                  Blockchain Protected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Product Hero Section */}
        <div className="mb-8">
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 p-8 flex items-center justify-center min-h-[400px]">
                <img 
                  src={getProductImage(product.name)}
                  alt={product.name}
                  className="max-w-full max-h-full object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="text-center hidden">
                  <Package className="w-24 h-24 mx-auto text-green-600 mb-4" />
                  <p className="text-green-700 font-medium">Premium Agricultural Product</p>
                  <p className="text-sm text-green-600 mt-2">{product.name}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-green-700 shadow-md">
                    <Leaf className="w-3 h-3 mr-1" />
                    Organic Certified
                  </Badge>
                </div>
              </div>
              
              {/* Product Details */}
              <CardContent className="p-6 md:p-8 bg-white">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                      {product.description || 'Premium quality agricultural product sourced directly from verified farms with complete traceability.'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="bg-green-50 p-4 rounded-lg flex-1 w-full">
                      <div className="text-2xl font-bold text-green-700">₹{product.finalPrice}/kg</div>
                      <div className="text-sm text-green-600">Consumer Price</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg flex-1 w-full">
                      <div className="text-2xl font-bold text-blue-700">{product.quantity} kg</div>
                      <div className="text-sm text-blue-600">Available Stock</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {getVerificationBadge(true, 'Quality')}
                    {getVerificationBadge(product.farmer.kycVerified, 'Farmer KYC')}
                    <Badge className="bg-orange-100 text-orange-800">
                      <Star className="w-3 h-3 mr-1" />
                      Premium Grade
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Price Breakdown Section */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
              Transparent Price Breakdown
            </CardTitle>
            <p className="text-blue-100 text-sm md:text-base">Complete cost transparency from farm to your table</p>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Leaf className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-700">Farm Gate Price</span>
                    <div className="text-xs text-green-600">Direct from farmer</div>
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-green-700">₹{product.pricePerKg}/kg</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Truck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700">Distribution Price</span>
                    <div className="text-xs text-blue-600">Including logistics</div>
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-blue-700">₹{product.distributionPrice}/kg</div>
                <div className="text-xs text-blue-600 mt-1">
                  +{Math.round(((product.distributionPrice! - product.pricePerKg) / product.pricePerKg) * 100)}% markup
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Store className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-700">Retail Price</span>
                    <div className="text-xs text-purple-600">Store price</div>
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-purple-700">₹{product.retailPrice}/kg</div>
                <div className="text-xs text-purple-600 mt-1">
                  +{Math.round(((product.retailPrice! - product.distributionPrice!) / product.distributionPrice!) * 100)}% markup
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-100 p-4 rounded-xl border-2 border-orange-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-orange-700">Final Consumer Price</span>
                    <div className="text-xs text-orange-600">Including all costs</div>
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-orange-700">₹{product.finalPrice}/kg</div>
                <div className="text-xs text-orange-600 mt-1">Total journey markup</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Progress */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Shield className="w-5 h-5 md:w-6 md:h-6" />
              Supply Chain Journey
            </CardTitle>
            <p className="text-green-100 text-sm md:text-base">Track your product's complete journey with blockchain verification</p>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700 text-sm md:text-base">Journey Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round(getSupplyChainProgress())}% Complete
                </span>
              </div>
              <Progress value={getSupplyChainProgress()} className="h-3" />
            </div>
            
            <div className="space-y-4">
              {product.supplyChainSteps?.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-sm">
                    <div className="flex-shrink-0">
                      <div className="p-2 md:p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-md">
                        {getStepIcon(step.step)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <h4 className="font-semibold text-base md:text-lg text-gray-800">{step.step}</h4>
                        <Badge className="bg-green-100 text-green-800 border-green-300 w-fit">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified ✓
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{step.actor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(step.date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}</span>
                        </div>
                        {step.price && (
                          <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{step.price}/kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < (product.supplyChainSteps?.length || 0) - 1 && (
                    <div className="absolute left-4 md:left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-green-400 to-blue-500"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verified Stakeholders Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Farmer Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Leaf className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-lg md:text-xl">Verified Farmer</div>
                  <div className="text-green-100 text-sm font-normal">Source & Quality Assured</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {product.farmer.fullName || product.farmer.name || 'Rajesh Kumar'}
                    </h3>
                    <p className="text-gray-600">Primary Producer</p>
                  </div>
                  {getVerificationBadge(product.farmer.kycVerified)}
                </div>
                
                <div className="grid gap-3">
                  {product.farmer.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-500">Farm Location</span>
                        <p className="font-medium break-words">{product.farmer.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {!product.farmer.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-500">Farm Location</span>
                        <p className="font-medium break-words">Village Rampur, Dist. Nashik, Maharashtra - 422009</p>
                      </div>
                    </div>
                  )}
                  
                  {product.farmer.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Contact</span>
                        <p className="font-medium">{maskPhoneNumber(product.farmer.phone)}</p>
                      </div>
                    </div>
                  )}
                  
                  {!product.farmer.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Contact</span>
                        <p className="font-medium">+91 987***45</p>
                      </div>
                    </div>
                  )}
                  
                  {product.farmer.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium break-words">{maskEmail(product.farmer.email)}</p>
                      </div>
                    </div>
                  )}
                  
                  {!product.farmer.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium break-words">ra***@farmerdirect.in</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-500">Harvest Date</span>
                      <p className="font-medium">{new Date(product.harvestDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  {product.farmer.experience && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Experience</span>
                        <p className="font-medium">{product.farmer.experience} years in farming</p>
                      </div>
                    </div>
                  )}
                  
                  {!product.farmer.experience && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Experience</span>
                        <p className="font-medium">15 years in organic farming</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-2 border-t">
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    <IdCard className="w-3 h-3 mr-1" />
                    Government ID Verified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Validators */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-lg md:text-xl">Quality Validators</div>
                  <div className="text-orange-100 text-sm font-normal">Independent Quality Assurance</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700 text-sm md:text-base">Validation Progress</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {product.validatorsApproved}/{product.totalValidators} Approved
                  </Badge>
                </div>
                <Progress 
                  value={(product.validatorsApproved / product.totalValidators) * 100} 
                  className="h-3 mb-2"
                />
                <p className="text-sm text-gray-600">
                  {product.validatorsApproved === product.totalValidators 
                    ? "✅ Fully validated by all independent quality inspectors"
                    : `${product.totalValidators - product.validatorsApproved} more validation(s) pending`
                  }
                </p>
              </div>
              
              {product.validators && product.validators.length > 0 ? (
                <div className="grid gap-4">
                  {product.validators.slice(0, 2).map((validator, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {validator.fullName || validator.name || `Validator ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {validator.certificationLevel || 'Certified Quality Inspector'}
                          </p>
                        </div>
                        {getVerificationBadge(validator.kycVerified)}
                      </div>
                      
                      {validator.validatedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>Validated: {new Date(validator.validatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {validator.rating && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{validator.rating}/5 Quality Rating</span>
                        </div>
                      )}
                      
                      {validator.notes && (
                        <div className="mt-2 p-2 bg-white rounded text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {validator.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Validator details will be updated once quality inspection is complete</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section */}
        {product.qrCode && (
          <Card className="mt-8 shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <CardTitle className="flex items-center justify-center gap-3 text-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-lg md:text-xl">Product Authentication QR</div>
                  <div className="text-gray-300 text-sm font-normal">Scan to verify authenticity & trace origin</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 text-center bg-gradient-to-br from-gray-50 to-white">
              <QRCodeDisplay qrCode={product.qrCode} productName={product.name} />
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-600">
                  This QR code contains blockchain-verified information about your product's journey
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
                  <Badge className="bg-blue-100 text-blue-800">Blockchain Secured</Badge>
                  <Badge className="bg-green-100 text-green-800">Tamper Proof</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Fully Traceable</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Metadata */}
        <Card className="mt-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm md:text-base">Product ID</span>
                <span className="font-mono text-sm break-all">{product._id.slice(-12)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm md:text-base">Created</span>
                <span className="text-sm">{new Date(product.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm md:text-base">Current Status</span>
                <Badge className={getStatusColor(product.status)}>
                  {product.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              {product.qrCode && (
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 text-sm md:text-base">QR Code</span>
                  <span className="font-mono text-sm break-all">{product.qrCode.slice(-12)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;