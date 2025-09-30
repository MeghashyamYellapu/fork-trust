import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useToast } from "@/hooks/use-toast";
import { QRCodeButton } from "@/components/QRCodeDisplay";
import { getWalletAddress, formatWalletAddress } from "@/utils/auth";
import { Star, MapPin, Filter, ShoppingCart, Truck, Package, CheckCircle, LogOut, Wallet } from "lucide-react";

interface Product {
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
  };
  qrCode?: string;
  createdAt: string;
}

const DistributorDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterCrop, setFilterCrop] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved products from API
  const fetchApprovedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/products');
      const products: Product[] = await response.json();
      
      console.log('All products from API:', products);
      console.log('Product statuses:', products.map(p => ({ name: p.name, status: p.status })));
      
      // Filter only approved products (for production)
      // For testing, we'll also show pending products that have some validator approval
      const approvedProducts = products.filter(p => 
        p.status === 'approved' || (p.status === 'pending' && p.validatorsApproved >= 0)
      );
      setAvailableProducts(approvedProducts);
      
      console.log('Filtered products for distributor:', approvedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch approved products",
        variant: "destructive",
      });
      
      // Fallback to mock data if API fails
      setAvailableProducts([
        {
          _id: '1',
          name: "Organic Tomatoes",
          farmer: { _id: '1', fullName: "Ravi Kumar" },
          pricePerKg: 45,
          quantity: 500,
          status: 'approved',
          validatorsApproved: 5,
          totalValidators: 5,
          harvestDate: '2024-01-15',
          createdAt: '2024-01-15T10:00:00Z',
          description: "Fresh organic tomatoes"
        }
      ] as Product[]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApprovedProducts();
  }, [fetchApprovedProducts]);  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Handle product acceptance for distribution
  const handleAcceptProduct = async (productId: string) => {
    try {
      console.log('Accepting product for distribution:', productId);
      console.log('Using token:', localStorage.getItem('token'));
      
      const response = await fetch(`http://localhost:4000/api/products/${productId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Accept response:', response.status, data);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product accepted for distribution successfully",
        });
        fetchApprovedProducts(); // Refresh the list
      } else {
        console.error('Accept failed:', data);
        throw new Error(data.message || 'Failed to accept product');
      }
    } catch (error) {
      console.error('Error accepting product:', error);
      toast({
        title: "Error",
        description: `Failed to accept product for distribution: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Mock data for orders
  const orders = [
    {
      id: "ORD001",
      product: "Organic Tomatoes",
      farmer: "Ravi Kumar",
      quantity: 100,
      status: "Delivered",
      date: "2024-01-15",
      amount: 4500
    },
    {
      id: "ORD002",
      product: "Basmati Rice",
      farmer: "Sunita Devi",
      quantity: 200,
      status: "In Transit",
      date: "2024-01-18",
      amount: 24000
    },
    {
      id: "ORD003",
      product: "Fresh Onions",
      farmer: "Mohan Singh",
      quantity: 150,
      status: "Processing",
      date: "2024-01-20",
      amount: 5250
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success text-success-foreground";
      case "In Transit": return "bg-warning text-warning-foreground";
      case "Processing": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="w-7 h-7 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('distributorDashboard')}</h1>
                <p className="text-xs text-muted-foreground">Product Distribution & Logistics</p>
              </div>
              {/* Show wallet address */}
              {(() => {
                const authWallet = getWalletAddress();
                return authWallet ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Wallet className="w-3 h-3 mr-1" />
                    {formatWalletAddress(authWallet)}
                  </Badge>
                ) : null;
              })()}
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                4.7 Rating
              </Badge>
              <LanguageSelector />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Available Products</p>
                  <p className="text-2xl font-bold">{availableProducts.length}</p>
                </div>
                <Package className="w-6 h-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Quantity</p>
                  <p className="text-2xl font-bold">
                    {availableProducts.reduce((sum, p) => sum + p.quantity, 0)}kg
                  </p>
                </div>
                <Truck className="w-6 h-6 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Price</p>
                  <p className="text-2xl font-bold">
                    ₹{availableProducts.length > 0 
                      ? Math.round(availableProducts.reduce((sum, p) => sum + p.pricePerKg, 0) / availableProducts.length)
                      : 0
                    }/kg
                  </p>
                </div>
                <Star className="w-6 h-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Quality Verified</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
                <CheckCircle className="w-6 h-6 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Products Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
              <CardTitle className="text-xl">{t('availableProducts')}</CardTitle>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <Input
                  placeholder="Location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-28 h-8"
                />
                <Select value={filterPrice} onValueChange={setFilterPrice}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50">₹0-50</SelectItem>
                    <SelectItem value="50-100">₹50-100</SelectItem>
                    <SelectItem value="100+">₹100+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCrop} onValueChange={setFilterCrop}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue placeholder="Crop Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-muted-foreground">Loading approved products...</p>
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="col-span-full text-center py-6">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Approved Products</h3>
                  <p className="text-muted-foreground">No products have been approved for distribution yet.</p>
                </div>
              ) : (
                availableProducts.map((product) => (
                  <Card key={product._id} className="hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-base">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {product.farmer?.fullName || product.farmer?.name || 'Producer'}
                          </p>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          Farm Location
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-3 h-3 fill-green-400 text-green-400 mr-1" />
                            <span className="text-xs font-medium">
                              {product.status === 'approved' ? 'Quality Approved' : 'Partially Approved'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              {product.validatorsApproved}/{product.totalValidators} Verified
                            </Badge>
                            <Badge 
                              variant={product.status === 'approved' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-primary">₹{product.pricePerKg}/kg</p>
                            <p className="text-sm text-muted-foreground">{product.quantity}kg available</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <p><strong>Harvest Date:</strong> {product.harvestDate}</p>
                          {product.description && (
                            <p className="mt-1 truncate"><strong>Description:</strong> {product.description}</p>
                          )}
                          {product.qrCode && (
                            <p className="mt-1"><strong>QR Code:</strong> {product.qrCode}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            className="flex-1 h-9"
                            onClick={() => handleAcceptProduct(product._id)}
                            disabled={false}
                            variant={product.status === 'approved' ? 'default' : 'outline'}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            {product.status === 'approved' 
                              ? 'Accept for Distribution' 
                              : `Accept for Distribution (${product.status})`
                            }
                          </Button>
                          
                          {product.qrCode && (
                            <QRCodeButton qrCode={product.qrCode} productName={product.name} />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{t('orderManagement')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold text-sm">Order ID</th>
                    <th className="text-left p-3 font-semibold text-sm">Product</th>
                    <th className="text-left p-3 font-semibold text-sm">Farmer</th>
                    <th className="text-left p-3 font-semibold text-sm">Quantity</th>
                    <th className="text-left p-3 font-semibold text-sm">Amount</th>
                    <th className="text-left p-3 font-semibold text-sm">Status</th>
                    <th className="text-left p-3 font-semibold text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium text-sm">{order.id}</td>
                      <td className="p-3 text-sm">{order.product}</td>
                      <td className="p-3 text-sm">{order.farmer}</td>
                      <td className="p-3 text-sm">{order.quantity}kg</td>
                      <td className="p-3 font-semibold text-sm">₹{order.amount.toLocaleString()}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DistributorDashboard;