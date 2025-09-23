import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
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
  CheckCircle2
} from "lucide-react";

const RetailerDashboard = () => {
  const { t } = useLanguage();
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterStock, setFilterStock] = useState("");

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
      rating: 4.8
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
      rating: 4.9
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
      rating: 4.6
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
      rating: 4.7
    }
  ];

  // Mock data for available products from distributors
  const availableProducts = [
    {
      id: 1,
      name: "Organic Carrots",
      distributor: "Farm Fresh Distributors",
      location: "Hyderabad, Telangana",
      price: 35,
      quantity: 500,
      quality: "Premium",
      rating: 4.8,
      margin: "22%"
    },
    {
      id: 2,
      name: "Red Chillies",
      distributor: "Spice Valley Co.",
      location: "Guntur, Andhra Pradesh",
      price: 250,
      quantity: 200,
      quality: "Grade A",
      rating: 4.9,
      margin: "28%"
    },
    {
      id: 3,
      name: "Coconuts",
      distributor: "Coastal Produce",
      location: "Vijayawada, Andhra Pradesh",
      price: 25,
      quantity: 300,
      quality: "Fresh",
      rating: 4.7,
      margin: "35%"
    }
  ];

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Retailer Dashboard</h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-1" />
                4.6 Store Rating
              </Badge>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80">Daily Revenue</p>
                  <p className="text-3xl font-bold">₹15.4K</p>
                </div>
                <IndianRupee className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80">Total Customers</p>
                  <p className="text-3xl font-bold">{customerStats.totalCustomers}</p>
                </div>
                <Users className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-accent text-accent-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80">Products</p>
                  <p className="text-3xl font-bold">{inventory.length}</p>
                </div>
                <Package className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-success text-success-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80">Avg Order</p>
                  <p className="text-3xl font-bold">₹{customerStats.avgOrderValue}</p>
                </div>
                <TrendingUp className="w-8 h-8" />
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
                      <td className="p-4 font-medium">{item.name}</td>
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
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <CardTitle className="text-2xl">Available Products</CardTitle>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <Input
                  placeholder="Location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-32"
                />
                <Select value={filterPrice} onValueChange={setFilterPrice}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50">₹0-50</SelectItem>
                    <SelectItem value="50-100">₹50-100</SelectItem>
                    <SelectItem value="100+">₹100+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStock} onValueChange={setFilterStock}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Margin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (25%+)</SelectItem>
                    <SelectItem value="medium">Medium (15-25%)</SelectItem>
                    <SelectItem value="low">Low (&lt;15%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">by {product.distributor}</p>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {product.location}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <Badge variant="outline">{product.quality}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-success text-success-foreground">
                          +{product.margin} Margin
                        </Badge>
                        <span className="text-sm text-muted-foreground">{product.quantity}kg available</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">₹{product.price}/kg</p>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Analytics */}
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

        {/* Quick Actions */}
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
        </Card>
      </div>
    </div>
  );
};

export default RetailerDashboard;