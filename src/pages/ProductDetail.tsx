import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Package, User, Calendar, MapPin, CheckCircle, Star, Truck, Store, Eye, DollarSign, Clock, Shield, Leaf } from 'lucide-react';

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
  farmer: {
    _id: string;
    fullName?: string;
    name?: string;
    location?: string;
    phone?: string;
    email?: string;
  };
  distributor?: {
    _id: string;
    fullName?: string;
    name?: string;
    location?: string;
    phone?: string;
    distributionDate?: string;
  };
  retailer?: {
    _id: string;
    fullName?: string;
    name?: string;
    location?: string;
    phone?: string;
    retailDate?: string;
  };
  validators?: Array<{
    _id: string;
    fullName?: string;
    name?: string;
    validatedAt?: string;
    rating?: number;
    notes?: string;
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
    // Create supply chain steps based on product status and data
    const supplyChainSteps = [
      {
        step: 'Harvest',
        date: baseProduct.harvestDate || baseProduct.createdAt,
        actor: baseProduct.farmer.fullName || baseProduct.farmer.name || 'Farmer',
        price: baseProduct.pricePerKg,
        status: 'completed'
      }
    ];

    // Add validation step if validators exist
    if (baseProduct.validatorsApproved > 0) {
      supplyChainSteps.push({
        step: 'Validation',
        date: baseProduct.createdAt,
        actor: `${baseProduct.validatorsApproved} Validators`,
        status: 'completed'
      });
    }

    // Add distribution step if product has been distributed
    if (baseProduct.status === 'in-distribution' || baseProduct.status === 'retail') {
      supplyChainSteps.push({
        step: 'Distribution',
        date: baseProduct.distributor?.distributionDate || baseProduct.createdAt,
        actor: baseProduct.distributor?.fullName || baseProduct.distributor?.name || 'Distributor',
        price: baseProduct.distributionPrice || baseProduct.pricePerKg * 1.2,
        status: 'completed'
      });
    }

    // Add retail step if product is at retail
    if (baseProduct.status === 'retail') {
      supplyChainSteps.push({
        step: 'Retail',
        date: baseProduct.retailer?.retailDate || baseProduct.createdAt,
        actor: baseProduct.retailer?.fullName || baseProduct.retailer?.name || 'Retailer',
        price: baseProduct.retailPrice || baseProduct.pricePerKg * 1.5,
        status: 'completed'
      });
    }

    return {
      ...baseProduct,
      supplyChainSteps,
      distributionPrice: baseProduct.distributionPrice || baseProduct.pricePerKg * 1.2,
      retailPrice: baseProduct.retailPrice || baseProduct.pricePerKg * 1.5,
      finalPrice: baseProduct.finalPrice || baseProduct.pricePerKg * 1.8,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(product.status)}>
                {product.status.replace('-', ' ').toUpperCase()}
              </Badge>
              {product.qrCode && (
                <Badge variant="outline" className="gap-1">
                  <Eye className="w-3 h-3" />
                  Trackable
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                    <p className="text-muted-foreground">{product.description || 'Premium quality agricultural product'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${product.pricePerKg}/kg</div>
                    <div className="text-sm text-muted-foreground">{product.quantity} kg available</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Supply Chain Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Supply Chain Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(getSupplyChainProgress())}% Complete
                    </span>
                  </div>
                  <Progress value={getSupplyChainProgress()} className="mb-4" />
                  
                  {/* Supply Chain Steps */}
                  <div className="space-y-3">
                    {product.supplyChainSteps?.map((step, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="flex-shrink-0">
                          {getStepIcon(step.step)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{step.step}</h4>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {step.actor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(step.date).toLocaleDateString()}
                            </span>
                            {step.price && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${step.price}/kg
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div>
                  <h3 className="font-semibold mb-4">Price Breakdown</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Farm Price</span>
                      </div>
                      <div className="text-lg font-bold">${product.pricePerKg}/kg</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Distribution</span>
                      </div>
                      <div className="text-lg font-bold">${product.distributionPrice}/kg</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Retail</span>
                      </div>
                      <div className="text-lg font-bold">${product.retailPrice}/kg</div>
                    </div>
                    <div className="p-3 rounded-lg border border-primary">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Final Price</span>
                      </div>
                      <div className="text-lg font-bold text-primary">${product.finalPrice}/kg</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stakeholders Information */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Farmer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Farmer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Name</span>
                    <p className="font-medium">{product.farmer.fullName || product.farmer.name}</p>
                  </div>
                  {product.farmer.location && (
                    <div>
                      <span className="text-sm text-muted-foreground">Location</span>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {product.farmer.location}
                      </p>
                    </div>
                  )}
                  {product.farmer.phone && (
                    <div>
                      <span className="text-sm text-muted-foreground">Contact</span>
                      <p>{product.farmer.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Harvest Date</span>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Distributor Information */}
              {product.distributor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      Distributor Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Name</span>
                      <p className="font-medium">{product.distributor.fullName || product.distributor.name}</p>
                    </div>
                    {product.distributor.location && (
                      <div>
                        <span className="text-sm text-muted-foreground">Location</span>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {product.distributor.location}
                        </p>
                      </div>
                    )}
                    {product.distributor.distributionDate && (
                      <div>
                        <span className="text-sm text-muted-foreground">Distribution Date</span>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(product.distributor.distributionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Retailer Information */}
              {product.retailer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="w-5 h-5 text-purple-600" />
                      Retailer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Name</span>
                      <p className="font-medium">{product.retailer.fullName || product.retailer.name}</p>
                    </div>
                    {product.retailer.location && (
                      <div>
                        <span className="text-sm text-muted-foreground">Location</span>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {product.retailer.location}
                        </p>
                      </div>
                    )}
                    {product.retailer.retailDate && (
                      <div>
                        <span className="text-sm text-muted-foreground">Retail Date</span>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(product.retailer.retailDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            {product.qrCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Product QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <QRCodeDisplay qrCode={product.qrCode} productName={product.name} />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Scan to verify authenticity
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Validation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span>Validators Approved</span>
                  <Badge variant="secondary">
                    {product.validatorsApproved}/{product.totalValidators}
                  </Badge>
                </div>
                <Progress 
                  value={(product.validatorsApproved / product.totalValidators) * 100} 
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {product.validatorsApproved === product.totalValidators 
                    ? "Fully validated by all inspectors"
                    : `${product.totalValidators - product.validatorsApproved} more validation(s) pending`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Product Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="text-sm font-mono">{product._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.replace('-', ' ')}
                  </Badge>
                </div>
                {product.qrCode && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">QR Code</span>
                    <span className="text-sm font-mono">{product.qrCode.slice(-8)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;