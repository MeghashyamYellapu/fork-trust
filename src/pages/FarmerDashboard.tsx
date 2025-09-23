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
  Package
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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
  pricePerKg: string;
  harvestDate: string;
  description: string;
}

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'add-product' | 'pending' | 'pricing' | 'history'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    quantity: '',
    pricePerKg: '',
    harvestDate: '',
    description: '',
  });

  // Mock data
  const [products] = useState<Product[]>([
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

  const marketPrices = [
    { crop: 'Rice', currentPrice: 42, recommendedPrice: 45, trend: 'up' },
    { crop: 'Wheat', currentPrice: 23, recommendedPrice: 25, trend: 'stable' },
    { crop: 'Tomatoes', currentPrice: 28, recommendedPrice: 30, trend: 'up' },
    { crop: 'Cotton', currentPrice: 85, recommendedPrice: 88, trend: 'up' },
  ];

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product submitted:', productForm);
    setShowAddProduct(false);
    setProductForm({
      name: '',
      quantity: '',
      pricePerKg: '',
      harvestDate: '',
      description: '',
    });
  };

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
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
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
            <h1 className="text-xl font-bold text-foreground">Farmer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
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
                <p className="text-sm text-muted-foreground">Approved Products</p>
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
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'add-product', label: 'Add Product', icon: Plus },
            { id: 'pending', label: 'Pending Approvals', icon: Clock },
            { id: 'pricing', label: 'Market Prices', icon: TrendingUp },
            { id: 'history', label: 'History', icon: History },
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
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
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setActiveTab('add-product')}
                  className="w-full btn-primary justify-start"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Product
                </Button>
                <Button 
                  onClick={() => setActiveTab('pending')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  View Pending Approvals
                </Button>
                <Button 
                  onClick={() => setActiveTab('pricing')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Check Market Prices
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'add-product' && (
          <Card className="card-elevated p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Add New Product</h3>
            <form onSubmit={handleSubmitProduct} className="space-y-6">
              <div>
                <Label className="text-large">Product Images</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Upload product images</p>
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="productName" className="text-large">Product Name</Label>
                <Select value={productForm.name} onValueChange={(value) => handleInputChange('name', value)}>
                  <SelectTrigger className="mt-2 text-lg">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice / వరి / चावल</SelectItem>
                    <SelectItem value="wheat">Wheat / గోధుమ / गेहूं</SelectItem>
                    <SelectItem value="tomatoes">Tomatoes / టమాటో / टमाटर</SelectItem>
                    <SelectItem value="cotton">Cotton / పత్తి / कपास</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane / చెరకు / गन्ना</SelectItem>
                    <SelectItem value="vegetables">Vegetables / కూరగాయలు / सब्जियां</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-large">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="mt-2 text-lg"
                    placeholder="Enter quantity in kg"
                  />
                </div>

                <div>
                  <Label htmlFor="pricePerKg" className="text-large">Price per Kg (₹)</Label>
                  <Input
                    id="pricePerKg"
                    type="number"
                    value={productForm.pricePerKg}
                    onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
                    className="mt-2 text-lg"
                    placeholder="Enter price per kg"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: ₹45 based on market analysis
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="harvestDate" className="text-large">Harvest Date</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={productForm.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-large">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-2 text-lg"
                  placeholder="Add any additional details about your product"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full btn-primary" size="lg">
                Submit for Validation
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'pending' && (
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Pending Approvals</h3>
              <p className="text-muted-foreground">Products awaiting validator approval</p>
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
                        <div className="w-full bg-muted rounded-full h-2 w-32">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(product.validatorsApproved / product.totalValidators) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.validatorsApproved}/{product.totalValidators} validators
                        </span>
                      </div>
                    </div>

                    {product.status === 'rejected' && product.rejectionReason && (
                      <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                        <p className="text-sm text-error font-medium mb-1">Rejection Reason:</p>
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
              <h3 className="text-lg font-semibold">Market Price Dashboard</h3>
              <p className="text-muted-foreground">AI-powered fair pricing recommendations</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketPrices.map((price, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-lg">{price.crop}</h4>
                      <div className={`flex items-center gap-1 ${
                        price.trend === 'up' ? 'text-success' : 
                        price.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{price.trend}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Price:</span>
                        <span className="font-medium">₹{price.currentPrice}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recommended:</span>
                        <span className="font-semibold text-primary">₹{price.recommendedPrice}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit Margin:</span>
                        <span className="font-medium text-success">
                          +₹{price.recommendedPrice - price.currentPrice}/kg
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'history' && (
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Product History</h3>
              <p className="text-muted-foreground">Your past uploads and sales</p>
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