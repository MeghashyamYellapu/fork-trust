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
import coconut from "@/assets/coconut.avif";
import tomato from "@/assets/Tomatoes.avif";
import red from "@/assets/redchillies.avif";
import { 
  Star, 
  MapPin, 
  Filter, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  IndianRupee,
  Eye,
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
  LogOut,
  Store,
  Wallet
} from "lucide-react";

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

const RetailerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products available for retail (in-distribution status)
  const fetchAvailableProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/products');
      const products: Product[] = await response.json();
      
      console.log('All products from API:', products);
      console.log('Product statuses:', products.map(p => ({ name: p.name, status: p.status })));
      
      // Filter only products in distribution (ready for retail)
      const retailProducts = products.filter(p => 
        p.status === 'in-distribution' || p.status === 'retail'
      );
      setAvailableProducts(retailProducts);
      
      console.log('Products available for retail:', retailProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available products",
        variant: "destructive",
      });
      
      // Fallback to mock data if API fails
      setAvailableProducts([
        {
          _id: '1',
          name: "Organic Tomatoes",
          farmer: { _id: '1', fullName: "Fresh Mart Distributors" },
          pricePerKg: 55,
          quantity: 45,
          status: 'in-distribution',
          validatorsApproved: 5,
          totalValidators: 5,
          harvestDate: '2024-01-15',
          createdAt: '2024-01-15T10:00:00Z',
          description: "Premium organic tomatoes"
        }
      ] as Product[]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAvailableProducts();
  }, [fetchAvailableProducts]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Handle adding product to retail inventory
  const handleAcceptForRetail = async (productId: string) => {
    try {
      console.log('Accepting product for retail:', productId);
      console.log('Using token:', localStorage.getItem('token'));
      
      const response = await fetch(`http://localhost:4000/api/products/${productId}/retail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Retail accept response:', response.status, data);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added to retail inventory successfully",
        });
        fetchAvailableProducts(); // Refresh the list
      } else {
        console.error('Retail accept failed:', data);
        throw new Error(data.message || 'Failed to add product to retail');
      }
    } catch (error) {
      console.error('Error adding product to retail:', error);
      toast({
        title: "Error",
        description: `Failed to add product to retail: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Mock data for inventory
  const inventory = [
    {
      id: 1,
      name: "Organic Tomatoes",
      supplier: "Fresh Mart Distributors",
      stock: 45,
      price: 55,
      sold: 155,
      status: "In Stock",
      margin: 18,
      rating: 4.8,
      image: tomato
    },
    {
      id: 2,
      name: "Basmati Rice",
      supplier: "Grain Valley Co.",
      stock: 8,
      price: 140,
      sold: 82,
      status: "Low Stock",
      margin: 15,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format&q=80"
    },
    {
      id: 3,
      name: "Fresh Onions",
      supplier: "Veggie Direct",
      stock: 0,
      price: 42,
      sold: 67,
      status: "Out of Stock",
      margin: 20,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop&auto=format&q=80"
    },
    {
      id: 4,
      name: "Green Apples",
      supplier: "Fruit Paradise",
      stock: 78,
      price: 180,
      sold: 234,
      status: "In Stock",
      margin: 25,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format&q=80"
    }
  ];

  // Mock data for available products - REPLACED WITH REAL API DATA
  // This is now fetched from fetchAvailableProducts() function

  // Mock customer analytics
  const customerStats = {
    totalCustomers: 1247,
    newCustomers: 23,
    repeatCustomers: 892,
    avgOrderValue: 485
  };

  // Mock sales data
  const salesData = [
    { period: "Today", revenue: 15400, orders: 32 },
    { period: "This Week", revenue: 98200, orders: 186 },
    { period: "This Month", revenue: 445600, orders: 892 }
  ];

  const getStockStatus = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-success text-success-foreground";
      case "Low Stock": return "bg-warning text-warning-foreground";
      case "Out of Stock": return "bg-destructive text-destructive-foreground";
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
              <Store className="w-7 h-7 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Retailer Dashboard</h1>
                <p className="text-xs text-muted-foreground">Retail Inventory Management</p>
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
                4.6 Store Rating
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
                <TrendingUp className="w-6 h-6 text-green-200" />
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
                <IndianRupee className="w-6 h-6 text-purple-200" />
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
                <CheckCircle2 className="w-6 h-6 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-primary" />
              Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {salesData.map((period, index) => (
                <div key={index} className="text-center p-6 bg-muted rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{period.period}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-primary">₹{(period.revenue/1000).toFixed(1)}K</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{period.orders}</p>
                      <p className="text-sm text-muted-foreground">Orders</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
<Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Users className="w-6 h-6 mr-3 text-primary" />
              Customer Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {customerStats.totalCustomers}
                </div>
                <div className="text-sm text-muted-foreground">Total Customers</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-success mb-2">
                  +{customerStats.newCustomers}
                </div>
                <div className="text-sm text-muted-foreground">New This Week</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-warning mb-2">
                  {customerStats.repeatCustomers}
                </div>
                <div className="text-sm text-muted-foreground">Repeat Customers</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-info mb-2">
                  ₹{customerStats.avgOrderValue}
                </div>
                <div className="text-sm text-muted-foreground">Avg Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Current Inventory */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <CardTitle className="text-2xl">Current Inventory</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">Supplier</th>
                    <th className="text-left p-4 font-semibold">Stock</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Sold</th>
                    <th className="text-left p-4 font-semibold">Margin</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Rating</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onLoad={(e) => {
                                console.log(`Image loaded successfully: ${item.name}`);
                              }}
                              onError={(e) => {
                                console.log(`Image failed to load: ${item.name}, URL: ${item.image}`);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.fallback-icon');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                            <div className="fallback-icon absolute inset-0 w-full h-full flex items-center justify-center bg-muted" style={{display: 'none'}}>
                              <Package className="w-6 h-6 text-muted-foreground" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{item.supplier}</td>
                      <td className="p-4">{item.stock}kg</td>
                      <td className="p-4 font-semibold">₹{item.price}/kg</td>
                      <td className="p-4">{item.sold}kg</td>
                      <td className="p-4 text-success font-medium">+{item.margin}%</td>
                      <td className="p-4">
                        <Badge className={getStockStatus(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {item.rating}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Available Products from Distributors */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
              <CardTitle className="text-xl">Available Products for Retail</CardTitle>
              
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
                <Select value={filterStock} onValueChange={setFilterStock}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue placeholder="Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-muted-foreground">Loading products available for retail...</p>
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="col-span-full text-center py-6">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Products Available</h3>
                  <p className="text-muted-foreground">No products are currently available for retail. Check back later.</p>
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
                            <CheckCircle2 className="w-3 h-3 fill-green-400 text-green-400 mr-1" />
                            <span className="text-xs font-medium">Quality Verified</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              {product.validatorsApproved}/{product.totalValidators} Verified
                            </Badge>
                            <Badge 
                              variant={product.status === 'in-distribution' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {product.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-50 text-blue-700 text-xs">
                            Ready for Retail
                          </Badge>
                          <span className="text-sm text-muted-foreground">{product.quantity}kg available</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-primary">₹{product.pricePerKg}/kg</p>
                            <p className="text-xs text-muted-foreground">Harvest: {product.harvestDate}</p>
                          </div>
                        </div>

                        {product.description && (
                          <div className="text-xs text-muted-foreground">
                            <p className="truncate"><strong>Description:</strong> {product.description}</p>
                          </div>
                        )}

                        {product.qrCode && (
                          <div className="text-xs text-muted-foreground">
                            <p><strong>QR Code:</strong> {product.qrCode}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            className="flex-1 h-9"
                            onClick={() => handleAcceptForRetail(product._id)}
                            variant={product.status === 'in-distribution' ? 'default' : 'outline'}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.status === 'in-distribution' 
                              ? 'Add to Store Inventory' 
                              : `Already in Retail (${product.status})`
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

        {/* Customer Analytics */}
        

        {/* Quick Actions
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span>Add Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="w-6 h-6" />
                <span>Customer List</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Package className="w-6 h-6" />
                <span>Manage Inventory</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default RetailerDashboard;