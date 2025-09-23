import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Truck, 
  Star, 
  Leaf, 
  Shield,
  ArrowLeft,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

const ConsumerQRResult = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  // Get product ID from URL params (in real app, this would fetch from blockchain)
  const productId = searchParams.get('id') || 'demo-product';

  // Mock product data (in real app, this would come from blockchain)
  const productData = {
    id: productId,
    name: "Organic Tomatoes",
    image: "/api/placeholder/300/200",
    farmer: {
      name: "Ravi Kumar",
      location: "Warangal, Telangana",
      phone: "+91 9876543210"
    },
    harvest: {
      date: "2024-01-10",
      method: "Organic Farming",
      certification: "Organic India Certified"
    },
    quality: {
      grade: "Premium Grade A",
      moisture: "85%",
      pesticide: "Zero Residue",
      validators: 5,
      approved: 5
    },
    journey: [
      {
        stage: "Harvested",
        date: "2024-01-10",
        location: "Farm - Warangal",
        status: "completed"
      },
      {
        stage: "Quality Check",
        date: "2024-01-11",
        location: "Validation Center",
        status: "completed"
      },
      {
        stage: "Distributor",
        date: "2024-01-12",
        location: "Fresh Mart Distributors",
        status: "completed"
      },
      {
        stage: "Retail Store",
        date: "2024-01-14",
        location: "Super Fresh Store",
        status: "completed"
      }
    ],
    sustainability: {
      carbonFootprint: "2.3 kg CO₂",
      waterUsage: "15 liters per kg",
      organicCertified: true
    },
    ratings: {
      average: 4.7,
      count: 156
    }
  };

  const handleRatingSubmit = () => {
    // In real app, submit to blockchain
    console.log("Rating submitted:", rating, feedback);
    alert("Thank you for your feedback!");
    setRating(0);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToHome')}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-success" />
                <span className="text-xl font-bold text-foreground">{t('blockchainVerified')}</span>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Product Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Leaf className="w-24 h-24 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{productData.name}</h1>
                  <Badge className="bg-success text-success-foreground text-lg px-4 py-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t('blockchainVerified')}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-3 text-primary" />
                    <span><strong>Farmer:</strong> {productData.farmer.name}</span>
                  </div>
                  <div className="flex items-center text-lg">
                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                    <span><strong>Harvested:</strong> {new Date(productData.harvest.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-lg">
                    <Star className="w-5 h-5 mr-3 text-yellow-500 fill-current" />
                    <span><strong>Rating:</strong> {productData.ratings.average}/5 ({productData.ratings.count} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farmer Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-primary" />
              {t('farmerInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Contact Details</h3>
                <p><strong>Name:</strong> {productData.farmer.name}</p>
                <p><strong>Location:</strong> {productData.farmer.location}</p>
                <p><strong>Phone:</strong> {productData.farmer.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Farming Method</h3>
                <p><strong>Method:</strong> {productData.harvest.method}</p>
                <p><strong>Certification:</strong> {productData.harvest.certification}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Journey */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Truck className="w-6 h-6 mr-3 text-primary" />
              {t('supplyChainJourney')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {productData.journey.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success-foreground" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{step.stage}</h3>
                        <p className="text-muted-foreground">{step.location}</p>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                        {new Date(step.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Verification */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Shield className="w-6 h-6 mr-3 text-primary" />
              {t('qualityVerification')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Quality Grade:</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">{productData.quality.grade}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Moisture Content:</span>
                  <span className="font-semibold">{productData.quality.moisture}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Pesticide Status:</span>
                  <Badge className="bg-success text-success-foreground">{productData.quality.pesticide}</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-primary text-primary-foreground rounded-lg">
                  <div className="text-3xl font-bold mb-2">
                    {productData.quality.approved}/{productData.quality.validators}
                  </div>
                  <div className="text-sm">Validators Approved</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Leaf className="w-6 h-6 mr-3 text-primary" />
              {t('sustainabilityReport')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {productData.sustainability.carbonFootprint}
                </div>
                <div className="text-sm text-muted-foreground">Carbon Footprint</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {productData.sustainability.waterUsage}
                </div>
                <div className="text-sm text-muted-foreground">Water Usage</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-success mb-2">
                  {productData.sustainability.organicCertified ? "✓" : "✗"}
                </div>
                <div className="text-sm text-muted-foreground">Organic Certified</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumer Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-primary" />
              {t('rateProduct')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Your Rating:</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Feedback (Optional):</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 border rounded-lg resize-none h-24 bg-background"
                />
              </div>
              
              <Button 
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="w-full md:w-auto"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {t('submitFeedback')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerQRResult;