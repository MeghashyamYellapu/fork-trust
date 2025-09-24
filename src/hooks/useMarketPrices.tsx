import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export interface MarketPrice {
  crop: string;
  currentPrice: number;
  recommendedPrice: number;
  trend: 'up' | 'down' | 'stable';
  minPrice: number;
  maxPrice: number;
  arrivals: string;
  state: string;
  district: string;
  market: string;
  date: string;
  variety?: string;
  grade?: string;
}

interface MarketPricesResponse {
  success: boolean;
  data: MarketPrice[];
  message: string;
}

export const useMarketPrices = (stateName: string = 'ODISHA', autoRefresh: boolean = true) => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentState, setCurrentState] = useState<string>(stateName);

  const fetchMarketPrices = useCallback(async (state?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const stateParam = state || currentState;
      const response = await apiFetch<MarketPricesResponse>(`/market-prices?state=${encodeURIComponent(stateParam)}`);
      
      if (response.success) {
        setMarketPrices(response.data);
        setLastUpdated(new Date());
        setCurrentState(stateParam);
      } else {
        throw new Error(response.message || 'Failed to fetch market prices');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching market prices';
      setError(errorMessage);
      console.error('Error fetching market prices:', err);
      
      // Fallback to mock data if API fails
      setMarketPrices([
        {
          crop: 'Rice',
          currentPrice: 38,
          recommendedPrice: 42,
          trend: 'up',
          minPrice: 35,
          maxPrice: 45,
          arrivals: '1800 MT',
          state: 'Odisha',
          district: 'Cuttack',
          market: 'eNAM',
          date: new Date().toISOString().split('T')[0],
          variety: 'Swarna',
          grade: 'FAQ'
        },
        {
          crop: 'Wheat',
          currentPrice: 22,
          recommendedPrice: 24,
          trend: 'stable',
          minPrice: 20,
          maxPrice: 25,
          arrivals: '950 MT',
          state: 'Odisha',
          district: 'Balasore',
          market: 'eNAM',
          date: new Date().toISOString().split('T')[0],
          variety: 'HD-2967',
          grade: 'FAQ'
        },
        {
          crop: 'Tomatoes',
          currentPrice: 32,
          recommendedPrice: 35,
          trend: 'up',
          minPrice: 28,
          maxPrice: 38,
          arrivals: '380 MT',
          state: 'Odisha',
          district: 'Khurda',
          market: 'eNAM',
          date: new Date().toISOString().split('T')[0],
          variety: 'Hybrid',
          grade: 'A'
        },
        {
          crop: 'Cotton',
          currentPrice: 82,
          recommendedPrice: 85,
          trend: 'stable',
          minPrice: 78,
          maxPrice: 88,
          arrivals: '150 MT',
          state: 'Odisha',
          district: 'Bargarh',
          market: 'eNAM',
          date: new Date().toISOString().split('T')[0],
          variety: 'Desi',
          grade: 'FAQ'
        }
      ]);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [currentState]);

  const changeState = async (newState: string) => {
    setCurrentState(newState);
    await fetchMarketPrices(newState);
  };

  const refreshPrices = async () => {
    try {
      await apiFetch('/market-prices/refresh', { method: 'POST' });
      await fetchMarketPrices();
    } catch (err) {
      console.error('Error refreshing market prices:', err);
      await fetchMarketPrices(); // Fallback to regular fetch
    }
  };

  const getPriceForCrop = (cropName: string): MarketPrice | undefined => {
    return marketPrices.find(price => 
      price.crop.toLowerCase().includes(cropName.toLowerCase())
    );
  };

  useEffect(() => {
    fetchMarketPrices();

    // Auto-refresh every 30 minutes if enabled
    if (autoRefresh) {
      const interval = setInterval(() => fetchMarketPrices(), 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [currentState, autoRefresh, fetchMarketPrices]);

  return {
    marketPrices,
    loading,
    error,
    lastUpdated,
    currentState,
    refreshPrices,
    getPriceForCrop,
    changeState,
    refetch: fetchMarketPrices
  };
};