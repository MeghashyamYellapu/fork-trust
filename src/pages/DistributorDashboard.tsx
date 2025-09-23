import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Star, MapPin, Filter, ShoppingCart, Truck, Package, CheckCircle } from "lucide-react";

const DistributorDashboard = () => {
  const { t } = useLanguage();
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterCrop, setFilterCrop] = useState("");

  // Mock data for available products
  const availableProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Ravi Kumar",
      location: "Warangal, Telangana",
      price: 45,
      quantity: 500,
      quality: "Premium",
      rating: 4.8,
      image: "/api/placeholder/200/150"
    },
    {
      id: 2,
      name: "Basmati Rice",
      farmer: "Sunita Devi",
      location: "Nizamabad, Telangana",
      price: 120,
      quantity: 1000,
      quality: "Grade A",
      rating: 4.9,
      image: "/api/placeholder/200/150"
    },
    {
      id: 3,
      name: "Fresh Onions",
      farmer: "Mohan Singh",
      location: "Kurnool, Andhra Pradesh",
      price: 35,
      quantity: 750,
      quality: "Standard",
      rating: 4.6,
      image: "/api/placeholder/200/150"
    }
  ];

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Distributor Dashboard</h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-1" />
                4.7 Rating
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
                  <p className="text-primary-foreground/80">Total Orders</p>
                  <p className="text-3xl font-bold">156</p>
                </div>
                <ShoppingCart className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80">This Month</p>
                  <p className="text-3xl font-bold">₹2.4L</p>
                </div>
                <Package className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-accent text-accent-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80">Active Orders</p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <Truck className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-success text-success-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80">Completed</p>
                  <p className="text-3xl font-bold">133</p>
                </div>
                <CheckCircle className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Products Section */}
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
                <Select value={filterCrop} onValueChange={setFilterCrop}>
                  <SelectTrigger className="w-32">
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
                        <p className="text-sm text-muted-foreground">by {product.farmer}</p>
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
                        <div>
                          <p className="text-2xl font-bold text-primary">₹{product.price}/kg</p>
                          <p className="text-sm text-muted-foreground">{product.quantity}kg available</p>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Order ID</th>
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">Farmer</th>
                    <th className="text-left p-4 font-semibold">Quantity</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{order.id}</td>
                      <td className="p-4">{order.product}</td>
                      <td className="p-4">{order.farmer}</td>
                      <td className="p-4">{order.quantity}kg</td>
                      <td className="p-4 font-semibold">₹{order.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4">{order.date}</td>
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