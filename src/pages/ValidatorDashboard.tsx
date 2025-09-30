import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Clock,
  LogOut,
  Star,
  Image as ImageIcon,
  Calendar,
  MapPin,
  User,
  Package,
  Wallet
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getWalletAddress, formatWalletAddress } from '@/utils/auth';

interface PendingProduct {
  id: string;
  farmerName: string;
  farmLocation: string;
  productName: string;
  quantity: number;
  pricePerKg: number;
  harvestDate: string;
  uploadDate: string;
  images: string[];
  description: string;
  validatorsApproved: number;
  totalValidators: number;
  myVote?: 'approved' | 'rejected' | null;
}

interface ApiProduct {
  _id: string;
  name: string;
  quantity: number;
  pricePerKg: number;
  harvestDate: string;
  createdAt: string;
  description?: string;
  status?: string;
  validatorsApproved?: number;
  totalValidators?: number;
}

const ValidatorDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'consensus' | 'history' | 'reputation'>('pending');
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products');
        const products: ApiProduct[] = await response.json();
        
        // Convert API products to PendingProduct format and filter for pending ones
        const formattedProducts = products
          .filter((p) => p.status === 'pending' || !p.status)
          .map((p) => ({
            id: p._id,
            farmerName: 'Producer', // TODO: Get from farmer data
            farmLocation: 'Farm Location', // TODO: Get from farmer profile  
            productName: p.name,
            quantity: p.quantity,
            pricePerKg: p.pricePerKg,
            harvestDate: p.harvestDate,
            uploadDate: p.createdAt,
            images: [], // TODO: Handle product images
            description: p.description || '',
            validatorsApproved: p.validatorsApproved || 0,
            totalValidators: p.totalValidators || 5,
            myVote: null as 'approved' | 'rejected' | null
          }));
        
        setPendingProducts(formattedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to mock data
        setPendingProducts([
          {
            id: '1',
            farmerName: 'Ramesh Kumar',
            farmLocation: 'Village Khandala, Pune, Maharashtra',
            productName: 'Organic Tomatoes',
            quantity: 500,
            pricePerKg: 45,
            harvestDate: '2024-01-25',
            uploadDate: '2024-01-26',
            images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
            description: 'Fresh organic tomatoes grown without pesticides. Rich in vitamins and perfect for cooking.',
            validatorsApproved: 2,
            totalValidators: 5,
            myVote: null,
          }
        ]);
      }
    };

    fetchProducts();
  }, []);

  // Mock data
  // Mock data
  const [validatorStats] = useState({
    reputationScore: 4.8,
    totalValidations: 156,
    accuracy: 96.2,
    rank: 12,
  });

  const handleVote = async (productId: string, vote: 'approved' | 'rejected') => {
    if (vote === 'rejected' && !rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      // Backend expects 'approve' or 'reject' (not 'approved' or 'rejected')
      const decision = vote === 'approved' ? 'approve' : 'reject';
      const token = localStorage.getItem('token');
      
      console.log('=== DEBUGGING APPROVAL REQUEST ===');
      console.log('Product ID:', productId);
      console.log('Vote:', vote);
      console.log('Decision:', decision);
      console.log('Token exists:', !!token);
      
      // Decode token to check role
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('JWT Payload:', payload);
          console.log('User Role:', payload.role);
        } catch (e) {
          console.log('Could not decode token:', e);
        }
      }
      
      console.log('Sending vote request:', {
        productId,
        decision,
        reason: vote === 'rejected' ? rejectionReason : undefined
      });
      
      const response = await fetch(`http://localhost:4000/api/products/${productId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          decision,
          reason: vote === 'rejected' ? rejectionReason : undefined 
        })
      });

      const responseData = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', responseData);

      if (response.ok) {
        toast({
          title: vote === 'approved' ? "Product Approved" : "Product Rejected",
          description: `The product has been ${vote} successfully.`,
        });
        
        // Update the local state
        setPendingProducts(prevProducts => 
          prevProducts.map(p => 
            p.id === productId 
              ? { 
                  ...p, 
                  myVote: vote,
                  validatorsApproved: vote === 'approved' ? p.validatorsApproved + 1 : p.validatorsApproved
                }
              : p
          )
        );
        
        setRejectionReason('');
        setSelectedProduct(null);
      } else {
        throw new Error(responseData.message || `Failed to ${vote} product`);
      }
    } catch (error) {
      console.error(`Error ${vote}ing product:`, error);
      
      // More detailed error handling
      let errorMessage = `Failed to ${vote} product. Please try again.`;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setSelectedProduct(null);
    setRejectionReason('');
  };

  const getConsensusStatus = (product: PendingProduct) => {
    const requiredVotes = Math.ceil(product.totalValidators * 0.6); // 60% consensus
    if (product.validatorsApproved >= requiredVotes) {
      return { status: 'approved', color: 'bg-success' };
    } else if (product.validatorsApproved < requiredVotes && product.totalValidators - product.validatorsApproved > product.totalValidators - requiredVotes) {
      return { status: 'rejected', color: 'bg-error' };
    }
    return { status: 'pending', color: 'bg-warning' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">{t('validatorDashboard')}</h1>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-warning" />
              <span className="font-medium">{validatorStats.reputationScore}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/farmer')}
              className="gap-2"
            >
              🌾 Farmer Dashboard
            </Button>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('pendingReviews')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingProducts.filter(p => !p.myVote).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('totalValidations')}</p>
                <p className="text-2xl font-bold text-foreground">{validatorStats.totalValidations}</p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('accuracyRate')}</p>
                <p className="text-2xl font-bold text-foreground">{validatorStats.accuracy}%</p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('rank')}</p>
                <p className="text-2xl font-bold text-foreground">#{validatorStats.rank}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'pending', label: t('pendingReviews'), icon: Clock },
            { id: 'consensus', label: t('consensusStatus'), icon: Users },
            { id: 'history', label: t('validationHistory'), icon: Shield },
            { id: 'reputation', label: t('reputation'), icon: Star },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as 'pending' | 'consensus' | 'history' | 'reputation')}
              className="gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {pendingProducts.filter(p => !p.myVote).map((product) => (
              <Card key={product.id} className="card-elevated">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{product.productName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {product.farmerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {product.farmLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-warning text-white">
                      {t('awaitingReview')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('quantity')}</p>
                          <p className="font-medium">{product.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('pricePerKg')}</p>
                          <p className="font-medium">₹{product.pricePerKg}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t('description')}</p>
                        <p className="text-foreground">{product.description}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t('consensusProgress')}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(product.validatorsApproved / product.totalValidators) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {product.validatorsApproved}/{product.totalValidators} {t('validators')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t('productImages')}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {product.images.slice(0, 4).map((image, index) => (
                            <div 
                              key={index}
                              className="bg-muted rounded-lg p-8 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                              onClick={() => setShowImageModal(true)}
                            >
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => setShowImageModal(true)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t('viewAllImages')}
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 bg-success hover:bg-success/90 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('approve')}
                        </Button>
                        <Button 
                          onClick={() => setSelectedProduct(product)}
                          variant="outline"
                          className="flex-1 border-error text-error hover:bg-error/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {t('reject')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {pendingProducts.filter(p => !p.myVote).length === 0 && (
              <Card className="card-elevated p-12 text-center">
                <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t('allCaughtUp')}</h3>
                <p className="text-muted-foreground">{t('noPendingProducts')}</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'consensus' && (
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">{t('consensusOverview')}</h3>
              <p className="text-muted-foreground">{t('productsAndStatus')}</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingProducts.map((product) => {
                  const consensus = getConsensusStatus(product);
                  return (
                    <div key={product.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{product.productName}</h4>
                          <p className="text-sm text-muted-foreground">{product.farmerName}</p>
                        </div>
                        <Badge className={`${consensus.color} text-white`}>
                          {consensus.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(product.validatorsApproved / product.totalValidators) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.validatorsApproved}/{product.totalValidators} approved
                        </span>
                        {product.myVote && (
                          <Badge variant="outline" className="text-xs">
                            {t('yourVote')} {product.myVote}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'reputation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold mb-4">Your Reputation Score</h3>
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-3xl font-bold text-primary">{validatorStats.reputationScore}</div>
                </div>
                <p className="text-muted-foreground">Out of 5.0</p>
              </div>
            </Card>

            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Validations:</span>
                  <span className="font-medium">{validatorStats.totalValidations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy Rate:</span>
                  <span className="font-medium text-success">{validatorStats.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Global Rank:</span>
                  <span className="font-medium">#{validatorStats.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-success text-white">Trusted Validator</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Vote Confirmation Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('confirmValidation')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{t('areYouSureValidate')}</p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{selectedProduct?.productName}</p>
              <p className="text-sm text-muted-foreground">{selectedProduct?.farmerName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t('reasonForRejection')}</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t('provideReasonPlaceholder')}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => selectedProduct && handleVote(selectedProduct.id, 'approved')}
                className="flex-1 bg-success hover:bg-success/90 text-white"
              >
                {t('approve')}
              </Button>
              <Button 
                onClick={() => selectedProduct && handleVote(selectedProduct.id, 'rejected')}
                variant="outline"
                className="flex-1 border-error text-error hover:bg-error/10"
              >
                {t('reject')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidatorDashboard;