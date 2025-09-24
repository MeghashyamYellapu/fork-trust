import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Shield, 
  Star, 
  Thermometer, 
  Droplet, 
  Leaf,
  CheckCircle,
  Package,
  User,
  Phone,
  Mail,
  Truck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import tomatoesImage from '@/assets/Tomatoes.avif';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Mock product data based on QR scan or image upload
  const generateMockProductData = (productId: string) => {
    const productConfigs = {
      'mock-tomatoes-batch-001': {
        name: 'Organic Fresh Tomatoes',
        image: tomatoesImage,
        category: 'Vegetable',
        variety: 'Hybrid Tomato',
        quantity: '50 kg',
        pricePerKg: '₹35',
        harvestDate: '2024-01-15',
        packagingDate: '2024-01-16',
        expiryDate: '2024-01-23',
        batchNumber: 'BTH24011501',
        organicStatus: 'Certified Organic',
        grade: 'Grade A Premium',
        farmerName: 'Rajesh Kumar',
        location: 'Warangal, Telangana',
        farmLocation: 'Village: Dharmasagar, Warangal',
        temperature: '22°C',
        humidity: '65%',
        soilPH: '6.8',
        rating: 4.8,
        reviews: 156,
        qualityScore: 95,
        carbonFootprint: '1.2 kg CO₂',
        waterUsage: '12 liters per kg'
      },
      'mock-rice-organic-002': {
        name: 'Premium Basmati Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center',
        category: 'Grain',
        variety: 'Basmati 1121',
        quantity: '100 kg',
        pricePerKg: '₹85',
        harvestDate: '2024-01-10',
        packagingDate: '2024-01-12',
        expiryDate: '2025-01-12',
        batchNumber: 'RIC24011001',
        organicStatus: 'Certified Organic',
        grade: 'Export Quality',
        farmerName: 'Priya Sharma',
        location: 'Punjab, India',
        farmLocation: 'Village: Khanna, Punjab',
        temperature: '18°C',
        humidity: '45%',
        soilPH: '7.2',
        rating: 4.9,
        reviews: 234,
        qualityScore: 98,
        carbonFootprint: '2.1 kg CO₂',
        waterUsage: '1800 liters per kg'
      },
      'mock-wheat-premium-003': {
        name: 'Golden Wheat Grain',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center',
        category: 'Grain',
        variety: 'Durum Wheat',
        quantity: '200 kg',
        pricePerKg: '₹25',
        harvestDate: '2024-01-08',
        packagingDate: '2024-01-10',
        expiryDate: '2024-12-10',
        batchNumber: 'WHT24010801',
        organicStatus: 'Naturally Grown',
        grade: 'Grade A',
        farmerName: 'Suresh Patel',
        location: 'Madhya Pradesh, India',
        farmLocation: 'Village: Indore, Madhya Pradesh',
        temperature: '16°C',
        humidity: '35%',
        soilPH: '7.5',
        rating: 4.6,
        reviews: 189,
        qualityScore: 92,
        carbonFootprint: '0.8 kg CO₂',
        waterUsage: '1200 liters per kg'
      },
      'mock-carrots-fresh-004': {
        name: 'Fresh Orange Carrots',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&crop=center',
        category: 'Vegetable',
        variety: 'Nantes Carrot',
        quantity: '75 kg',
        pricePerKg: '₹40',
        harvestDate: '2024-01-18',
        packagingDate: '2024-01-19',
        expiryDate: '2024-02-15',
        batchNumber: 'CAR24011801',
        organicStatus: 'Certified Organic',
        grade: 'Premium Fresh',
        farmerName: 'Meera Reddy',
        location: 'Karnataka, India',
        farmLocation: 'Village: Bangalore Rural, Karnataka',
        temperature: '20°C',
        humidity: '70%',
        soilPH: '6.5',
        rating: 4.7,
        reviews: 98,
        qualityScore: 94,
        carbonFootprint: '0.6 kg CO₂',
        waterUsage: '8 liters per kg'
      },
      'mock-apples-red-005': {
        name: 'Himalayan Red Apples',
        image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&h=300&fit=crop&crop=center',
        category: 'Fruit',
        variety: 'Red Delicious',
        quantity: '60 kg',
        pricePerKg: '₹120',
        harvestDate: '2024-01-05',
        packagingDate: '2024-01-06',
        expiryDate: '2024-03-06',
        batchNumber: 'APP24010501',
        organicStatus: 'Certified Organic',
        grade: 'Premium Export',
        farmerName: 'Vikram Singh',
        location: 'Himachal Pradesh, India',
        farmLocation: 'Village: Shimla, Himachal Pradesh',
        temperature: '12°C',
        humidity: '55%',
        soilPH: '6.8',
        rating: 4.9,
        reviews: 276,
        qualityScore: 97,
        carbonFootprint: '0.4 kg CO₂',
        waterUsage: '700 liters per kg'
      }
    };

    const config = productConfigs[productId as keyof typeof productConfigs] || productConfigs['mock-tomatoes-batch-001'];
    
    return {
      id: productId || 'demo',
      name: config.name,
      image: config.image,
      farmer: {
        name: config.farmerName,
        location: config.location,
        phone: '+91 9876543210',
        email: `${config.farmerName.toLowerCase().replace(' ', '.')}.farmer@gmail.com`,
        experience: '15 years',
        certification: 'Organic India Certified'
      },
      product: {
        category: config.category,
        variety: config.variety,
        quantity: config.quantity,
        pricePerKg: config.pricePerKg,
        harvestDate: config.harvestDate,
        packagingDate: config.packagingDate,
        expiryDate: config.expiryDate,
        batchNumber: config.batchNumber,
        organicStatus: config.organicStatus,
        grade: config.grade
      },
      iotData: {
        temperature: config.temperature,
        humidity: config.humidity,
        soilPH: config.soilPH,
        lastUpdated: '2024-01-16 10:30 AM'
      },
      gpsCoordinates: {
        latitude: '18.0011°N',
        longitude: '79.5947°E',
        farmLocation: config.farmLocation
      },
      qualityMetrics: {
        rating: config.rating,
        reviews: config.reviews,
        validatedBy: 5,
        totalValidators: 5,
        qualityScore: config.qualityScore
      },
      supplyChain: [
        {
          stage: 'Harvested',
          date: config.harvestDate,
          location: config.farmLocation,
          status: 'completed',
          verifiedBy: 'Farm Inspector'
        },
        {
          stage: 'Quality Check',
          date: config.harvestDate,
          location: 'Farm Collection Center',
          status: 'completed',
          verifiedBy: 'Quality Inspector'
        },
        {
          stage: 'Packaging',
          date: config.packagingDate,
          location: 'Processing Center',
          status: 'completed',
          verifiedBy: 'Packaging Team'
        },
        {
          stage: 'Distribution',
          date: config.packagingDate,
          location: 'Transport Hub',
          status: 'in-progress',
          verifiedBy: 'Logistics Partner'
        }
      ],
      certifications: ['Organic India', 'FSSAI Certified', 'GAP Certified'],
      sustainability: {
        carbonFootprint: config.carbonFootprint,
        waterUsage: config.waterUsage,
        organicPesticides: true,
        renewableEnergy: 85
      }
    };
  };

  const mockProductData = generateMockProductData(id || 'demo');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              {language === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
            </Button>
            <Badge variant="default" className="bg-green-600">
              {language === 'en' ? 'Verified Product' : 'सत्यापित उत्पाद'}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={mockProductData.image}
                      alt={mockProductData.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {mockProductData.name}
                    </h1>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Package className="text-green-600" size={20} />
                        <span className="text-gray-700">
                          {language === 'en' ? 'Quantity:' : 'मात्रा:'} {mockProductData.product.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-600">
                          {mockProductData.product.pricePerKg}
                        </span>
                        <span className="text-gray-600">{language === 'en' ? 'per kg' : 'प्रति किलो'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="text-yellow-500 fill-current" size={20} />
                        <span className="font-semibold">{mockProductData.qualityMetrics.rating}/5</span>
                        <span className="text-gray-600">({mockProductData.qualityMetrics.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge className="bg-green-100 text-green-800">{mockProductData.product.organicStatus}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{mockProductData.product.grade}</Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          {language === 'en' ? 'Fresh' : 'ताज़ा'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-green-600" size={24} />
                  {language === 'en' ? 'Farmer Information' : 'किसान की जानकारी'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">{mockProductData.farmer.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-500" size={16} />
                      <span className="text-gray-700">{mockProductData.farmer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-500" size={16} />
                      <span className="text-gray-700">{mockProductData.farmer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-gray-500" size={16} />
                      <span className="text-gray-700">{mockProductData.farmer.email}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{language === 'en' ? 'Certifications' : 'प्रमाणपत्र'}</h4>
                  <div className="space-y-2">
                    {mockProductData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IoT Sensor Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="text-blue-600" size={24} />
                  {language === 'en' ? 'IoT Sensor Data' : 'IoT सेंसर डेटा'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Thermometer className="text-red-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-600">{language === 'en' ? 'Temperature' : 'तापमान'}</p>
                    <p className="font-semibold text-lg">{mockProductData.iotData.temperature}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Droplet className="text-blue-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-600">{language === 'en' ? 'Humidity' : 'आर्द्रता'}</p>
                    <p className="font-semibold text-lg">{mockProductData.iotData.humidity}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Leaf className="text-green-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-600">{language === 'en' ? 'Soil pH' : 'मिट्टी pH'}</p>
                    <p className="font-semibold text-lg">{mockProductData.iotData.soilPH}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Shield className="text-purple-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-600">{language === 'en' ? 'Quality Score' : 'गुणवत्ता स्कोर'}</p>
                    <p className="font-semibold text-lg">{mockProductData.qualityMetrics.qualityScore}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  {language === 'en' ? 'Last updated:' : 'अंतिम अद्यतन:'} {mockProductData.iotData.lastUpdated}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Product Details' : 'उत्पाद विवरण'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'en' ? 'Category:' : 'श्रेणी:'}</span>
                  <span className="font-medium">{mockProductData.product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'en' ? 'Variety:' : 'किस्म:'}</span>
                  <span className="font-medium">{mockProductData.product.variety}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'en' ? 'Harvest Date:' : 'फसल की तारीख:'}</span>
                  <span className="font-medium">{mockProductData.product.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'en' ? 'Expiry Date:' : 'समाप्ति दिनांक:'}</span>
                  <span className="font-medium">{mockProductData.product.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'en' ? 'Batch Number:' : 'बैच संख्या:'}</span>
                  <span className="font-medium">{mockProductData.product.batchNumber}</span>
                </div>
              </CardContent>
            </Card>

            {/* GPS Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-red-600" size={20} />
                  {language === 'en' ? 'Farm Location' : 'खेत का स्थान'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{language === 'en' ? 'Coordinates:' : 'निर्देशांक:'}</p>
                  <p className="font-mono text-sm">{mockProductData.gpsCoordinates.latitude}, {mockProductData.gpsCoordinates.longitude}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{language === 'en' ? 'Address:' : 'पता:'}</p>
                  <p className="text-sm">{mockProductData.gpsCoordinates.farmLocation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Journey */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="text-blue-600" size={20} />
                  {language === 'en' ? 'Supply Chain' : 'आपूर्ति श्रृंखला'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProductData.supplyChain.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        step.status === 'completed' ? 'bg-green-500' : 
                        step.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{step.stage}</p>
                        <p className="text-xs text-gray-600">{step.location}</p>
                        <p className="text-xs text-gray-500">{step.date}</p>
                      </div>
                      {step.status === 'completed' && (
                        <CheckCircle className="text-green-500" size={16} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;