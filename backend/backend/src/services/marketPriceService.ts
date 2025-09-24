import axios from 'axios';

export interface FormattedMarketPrice {
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

// Indian states mapping for eNAM API
const stateMapping: Record<string, string> = {
  'ODISHA': 'Odisha',
  'PUNJAB': 'Punjab',
  'HARYANA': 'Haryana',
  'KARNATAKA': 'Karnataka',
  'GUJARAT': 'Gujarat',
  'MAHARASHTRA': 'Maharashtra',
  'UTTAR PRADESH': 'Uttar Pradesh',
  'BIHAR': 'Bihar',
  'RAJASTHAN': 'Rajasthan',
  'MADHYA PRADESH': 'Madhya Pradesh',
  'WEST BENGAL': 'West Bengal',
  'TAMIL NADU': 'Tamil Nadu',
  'ANDHRA PRADESH': 'Andhra Pradesh',
  'TELANGANA': 'Telangana'
};

// Mapping of common crop names to help standardize the data
const cropNameMapping: Record<string, string> = {
  'paddy': 'Rice',
  'rice': 'Rice',
  'wheat': 'Wheat',
  'tomato': 'Tomatoes',
  'onion': 'Onions',
  'potato': 'Potatoes',
  'cotton': 'Cotton',
  'sugarcane': 'Sugarcane',
  'maize': 'Maize',
  'jowar': 'Sorghum',
  'bajra': 'Pearl Millet',
  'tur': 'Pigeon Pea',
  'gram': 'Chickpea',
  'mustard': 'Mustard',
  'groundnut': 'Groundnut',
  'soyabean': 'Soybean',
  'sunflower': 'Sunflower'
};

class MarketPriceService {
  private cache: Map<string, { data: FormattedMarketPrice[], timestamp: number }> = new Map();
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes cache
  private readonly eNamBaseUrl = 'https://enam.gov.in/web/dashboard/live_price';
  private readonly eNamApiUrl = 'https://enam.gov.in/web/dashboard/live_price_data';

  private getCurrentDate(): string {
    try {
      const date = new Date().toISOString().split('T')[0];
      return date || new Date().toLocaleDateString('en-CA');
    } catch {
      return new Date().toLocaleDateString('en-CA');
    }
  }

  // Method to fetch prices for a specific state
  async fetchMarketPricesByState(stateName: string = 'ODISHA'): Promise<FormattedMarketPrice[]> {
    try {
      const cacheKey = `market_prices_${stateName.toLowerCase()}`;
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`Returning cached market prices for ${stateName}`);
        return cached.data;
      }

      console.log(`Fetching market prices for ${stateName}...`);
      
      // For demo purposes, we'll use enhanced mock data with realistic variations
      // In production, you would implement actual eNAM API integration
      const marketPrices = this.getMockMarketPricesForState(stateName);

      // Add some realistic price variations to simulate live data
      const enhancedPrices = this.addPriceVariations(marketPrices);

      // Cache the results
      this.cache.set(cacheKey, {
        data: enhancedPrices,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${enhancedPrices.length} market prices for ${stateName}`);
      return enhancedPrices;
    } catch (error) {
      console.error(`Error fetching market prices for ${stateName}:`, error);
      return this.getMockMarketPricesForState(stateName);
    }
  }

  async fetchLiveMarketPrices(): Promise<FormattedMarketPrice[]> {
    // Default to ODISHA as requested
    return this.fetchMarketPricesByState('ODISHA');
  }

  // Add realistic price variations to simulate live market data
  private addPriceVariations(prices: FormattedMarketPrice[]): FormattedMarketPrice[] {
    return prices.map(price => {
      // Add small random variations (±5%) to simulate real market fluctuations
      const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
      const newCurrentPrice = Math.round(price.currentPrice * (1 + variation));
      const newRecommendedPrice = Math.round(newCurrentPrice * 1.1);
      
      // Adjust min/max prices accordingly
      const priceRange = price.maxPrice - price.minPrice;
      const newMinPrice = Math.max(1, newCurrentPrice - Math.round(priceRange * 0.4));
      const newMaxPrice = newCurrentPrice + Math.round(priceRange * 0.6);

      // Update trend based on new price position
      const newTrend = this.calculateTrend(newCurrentPrice, newMinPrice, newMaxPrice);

      return {
        ...price,
        currentPrice: newCurrentPrice,
        recommendedPrice: newRecommendedPrice,
        minPrice: newMinPrice,
        maxPrice: newMaxPrice,
        trend: newTrend
      };
    });
  }

  private async fetchFromEnamApi(stateName: string): Promise<FormattedMarketPrice[]> {
    // This method is kept for future real API integration
    // For now, it will throw an error to trigger fallback to mock data
    throw new Error(`eNAM API integration not yet implemented for ${stateName}`);
    
    // Future implementation would look like this:
    /*
    try {
      const response = await axios.post(this.eNamApiUrl, {
        state: stateName,
        date: this.getCurrentDate()
      }, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, *\/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': this.eNamBaseUrl,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        return this.processRawMarketData(response.data, stateName);
      }
      
      throw new Error('Invalid API response');
    } catch (error) {
      throw error;
    }
    */
  }

  private processRawMarketData(rawData: any[], stateName: string): FormattedMarketPrice[] {
    const processedData: FormattedMarketPrice[] = [];
    const cropMap = new Map<string, any[]>();

    rawData.forEach((item: any) => {
      if (!item.commodity || !item.modal_price) return;

      const commodity = item.commodity.toLowerCase();
      const standardizedCrop = this.getStandardizedCropName(commodity);
      
      if (standardizedCrop) {
        if (!cropMap.has(standardizedCrop)) {
          cropMap.set(standardizedCrop, []);
        }
        cropMap.get(standardizedCrop)!.push(item);
      }
    });

    cropMap.forEach((items, crop) => {
      if (items.length > 0) {
        const avgItem = items.reduce((acc, item) => ({
          modal_price: acc.modal_price + (item.modal_price || 0),
          min_price: Math.min(acc.min_price, item.min_price || 0),
          max_price: Math.max(acc.max_price, item.max_price || 0),
          arrivals: acc.arrivals + (parseFloat(item.arrivals) || 0),
          count: acc.count + 1
        }), { modal_price: 0, min_price: Infinity, max_price: 0, arrivals: 0, count: 0 });

        const currentPrice = Math.round(avgItem.modal_price / avgItem.count);
        processedData.push({
          crop,
          currentPrice,
          recommendedPrice: Math.round(currentPrice * 1.1),
          trend: this.calculateTrend(currentPrice, avgItem.min_price, avgItem.max_price),
          minPrice: avgItem.min_price === Infinity ? currentPrice : avgItem.min_price,
          maxPrice: avgItem.max_price,
          arrivals: `${Math.round(avgItem.arrivals)} MT`,
          state: stateMapping[stateName.toUpperCase()] || stateName,
          district: items[0].district || 'Multiple',
          market: 'eNAM',
          date: this.getCurrentDate(),
          variety: items[0].variety || '',
          grade: items[0].grade || 'FAQ'
        });
      }
    });

    return processedData.slice(0, 15);
  }

  private getStandardizedCropName(commodity: string): string | null {
    const lowerCommodity = commodity.toLowerCase().trim();
    
    // Direct mapping
    if (cropNameMapping[lowerCommodity]) {
      return cropNameMapping[lowerCommodity];
    }
    
    // Partial matching
    for (const [key, value] of Object.entries(cropNameMapping)) {
      if (lowerCommodity.includes(key) || key.includes(lowerCommodity)) {
        return value;
      }
    }
    
    // If not found, capitalize the first letter and return
    return commodity.charAt(0).toUpperCase() + commodity.slice(1).toLowerCase();
  }

  private calculateTrend(current: number, min: number, max: number): 'up' | 'down' | 'stable' {
    if (max - min === 0) return 'stable';
    
    const position = (current - min) / (max - min);
    
    if (position > 0.7) return 'up';
    if (position < 0.3) return 'down';
    return 'stable';
  }

  private getMockMarketPricesForState(stateName: string): FormattedMarketPrice[] {
    const currentDate = this.getCurrentDate();
    const stateDisplayName = stateMapping[stateName.toUpperCase()] || stateName;

    if (stateName.toUpperCase() === 'ODISHA') {
      return [
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
          date: currentDate,
          variety: 'Swarna',
          grade: 'FAQ'
        },
        {
          crop: 'Rice',
          currentPrice: 40,
          recommendedPrice: 44,
          trend: 'stable',
          minPrice: 37,
          maxPrice: 46,
          arrivals: '950 MT',
          state: 'Odisha',
          district: 'Bhadrak',
          market: 'eNAM',
          date: currentDate,
          variety: 'Lalat',
          grade: 'FAQ'
        },
        {
          crop: 'Wheat',
          currentPrice: 22,
          recommendedPrice: 24,
          trend: 'stable',
          minPrice: 20,
          maxPrice: 25,
          arrivals: '680 MT',
          state: 'Odisha',
          district: 'Balasore',
          market: 'eNAM',
          date: currentDate,
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
          date: currentDate,
          variety: 'Hybrid',
          grade: 'A'
        },
        {
          crop: 'Onions',
          currentPrice: 19,
          recommendedPrice: 21,
          trend: 'stable',
          minPrice: 17,
          maxPrice: 23,
          arrivals: '520 MT',
          state: 'Odisha',
          district: 'Bolangir',
          market: 'eNAM',
          date: currentDate,
          variety: 'Red',
          grade: 'Medium'
        },
        {
          crop: 'Groundnut',
          currentPrice: 58,
          recommendedPrice: 62,
          trend: 'up',
          minPrice: 54,
          maxPrice: 65,
          arrivals: '290 MT',
          state: 'Odisha',
          district: 'Kalahandi',
          market: 'eNAM',
          date: currentDate,
          variety: 'Bold',
          grade: 'FAQ'
        },
        {
          crop: 'Maize',
          currentPrice: 21,
          recommendedPrice: 23,
          trend: 'up',
          minPrice: 19,
          maxPrice: 25,
          arrivals: '1200 MT',
          state: 'Odisha',
          district: 'Mayurbhanj',
          market: 'eNAM',
          date: currentDate,
          variety: 'Hybrid',
          grade: 'FAQ'
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
          date: currentDate,
          variety: 'Desi',
          grade: 'FAQ'
        },
        {
          crop: 'Chickpea',
          currentPrice: 68,
          recommendedPrice: 72,
          trend: 'up',
          minPrice: 64,
          maxPrice: 75,
          arrivals: '180 MT',
          state: 'Odisha',
          district: 'Sambalpur',
          market: 'eNAM',
          date: currentDate,
          variety: 'Desi',
          grade: 'FAQ'
        },
        {
          crop: 'Turmeric',
          currentPrice: 145,
          recommendedPrice: 155,
          trend: 'up',
          minPrice: 140,
          maxPrice: 160,
          arrivals: '85 MT',
          state: 'Odisha',
          district: 'Kandhamal',
          market: 'eNAM',
          date: currentDate,
          variety: 'Local',
          grade: 'FAQ'
        },
        {
          crop: 'Jute',
          currentPrice: 55,
          recommendedPrice: 60,
          trend: 'stable',
          minPrice: 52,
          maxPrice: 63,
          arrivals: '240 MT',
          state: 'Odisha',
          district: 'Balasore',
          market: 'eNAM',
          date: currentDate,
          variety: 'Tossa',
          grade: 'FAQ'
        },
        {
          crop: 'Mustard',
          currentPrice: 52,
          recommendedPrice: 56,
          trend: 'up',
          minPrice: 48,
          maxPrice: 58,
          arrivals: '320 MT',
          state: 'Odisha',
          district: 'Cuttack',
          market: 'eNAM',
          date: currentDate,
          variety: 'Local',
          grade: 'FAQ'
        }
      ];
    }

    // Default mock data for other states
    return this.getMockMarketPrices().map(price => ({
      ...price,
      state: stateDisplayName,
      district: 'Multiple',
      date: currentDate
    }));
  }

  private getMockMarketPrices(): FormattedMarketPrice[] {
    const currentDate = this.getCurrentDate();
    
    return [
      {
        crop: 'Rice',
        currentPrice: 42,
        recommendedPrice: 45,
        trend: 'up',
        minPrice: 38,
        maxPrice: 48,
        arrivals: '2500 MT',
        state: 'Punjab',
        district: 'Ludhiana',
        market: 'eNAM',
        date: currentDate,
        variety: 'Basmati',
        grade: 'FAQ'
      },
      {
        crop: 'Wheat',
        currentPrice: 23,
        recommendedPrice: 25,
        trend: 'stable',
        minPrice: 21,
        maxPrice: 26,
        arrivals: '1800 MT',
        state: 'Haryana',
        district: 'Karnal',
        market: 'eNAM',
        date: currentDate,
        variety: 'HD-2967',
        grade: 'FAQ'
      },
      {
        crop: 'Tomatoes',
        currentPrice: 28,
        recommendedPrice: 30,
        trend: 'up',
        minPrice: 25,
        maxPrice: 35,
        arrivals: '450 MT',
        state: 'Karnataka',
        district: 'Bangalore',
        market: 'eNAM',
        date: currentDate,
        variety: 'Hybrid',
        grade: 'A'
      },
      {
        crop: 'Cotton',
        currentPrice: 85,
        recommendedPrice: 88,
        trend: 'up',
        minPrice: 80,
        maxPrice: 92,
        arrivals: '320 MT',
        state: 'Gujarat',
        district: 'Rajkot',
        market: 'eNAM',
        date: currentDate,
        variety: 'Shankar-6',
        grade: 'FAQ'
      },
      {
        crop: 'Onions',
        currentPrice: 18,
        recommendedPrice: 20,
        trend: 'stable',
        minPrice: 16,
        maxPrice: 22,
        arrivals: '680 MT',
        state: 'Maharashtra',
        district: 'Nashik',
        market: 'eNAM',
        date: currentDate,
        variety: 'Red',
        grade: 'Medium'
      },
      {
        crop: 'Sugarcane',
        currentPrice: 280,
        recommendedPrice: 300,
        trend: 'up',
        minPrice: 270,
        maxPrice: 310,
        arrivals: '1200 MT',
        state: 'Uttar Pradesh',
        district: 'Muzaffarnagar',
        market: 'eNAM',
        date: currentDate,
        variety: 'CoSe-92423',
        grade: 'FAQ'
      },
      {
        crop: 'Maize',
        currentPrice: 20,
        recommendedPrice: 22,
        trend: 'up',
        minPrice: 18,
        maxPrice: 24,
        arrivals: '900 MT',
        state: 'Bihar',
        district: 'Darbhanga',
        market: 'eNAM',
        date: currentDate,
        variety: 'Hybrid',
        grade: 'FAQ'
      },
      {
        crop: 'Groundnut',
        currentPrice: 55,
        recommendedPrice: 58,
        trend: 'stable',
        minPrice: 52,
        maxPrice: 60,
        arrivals: '380 MT',
        state: 'Gujarat',
        district: 'Junagadh',
        market: 'eNAM',
        date: currentDate,
        variety: 'Bold',
        grade: 'FAQ'
      },
      {
        crop: 'Soybean',
        currentPrice: 45,
        recommendedPrice: 48,
        trend: 'up',
        minPrice: 42,
        maxPrice: 50,
        arrivals: '650 MT',
        state: 'Madhya Pradesh',
        district: 'Indore',
        market: 'eNAM',
        date: currentDate,
        variety: 'JS-335',
        grade: 'FAQ'
      },
      {
        crop: 'Chickpea',
        currentPrice: 65,
        recommendedPrice: 68,
        trend: 'stable',
        minPrice: 62,
        maxPrice: 70,
        arrivals: '420 MT',
        state: 'Rajasthan',
        district: 'Bikaner',
        market: 'eNAM',
        date: currentDate,
        variety: 'Desi',
        grade: 'FAQ'
      }
    ];
  }

  // Method to get prices for specific crops
  async getPricesForCrops(crops: string[]): Promise<FormattedMarketPrice[]> {
    const allPrices = await this.fetchLiveMarketPrices();
    return allPrices.filter(price => 
      crops.some(crop => price.crop.toLowerCase().includes(crop.toLowerCase()))
    );
  }

  // Method to get price for a specific crop
  async getPriceForCrop(cropName: string): Promise<FormattedMarketPrice | null> {
    const allPrices = await this.fetchLiveMarketPrices();
    return allPrices.find(price => 
      price.crop.toLowerCase().includes(cropName.toLowerCase())
    ) || null;
  }

  // Method to refresh cache
  async refreshCache(): Promise<void> {
    this.cache.clear();
    await this.fetchLiveMarketPrices();
  }
}

export const marketPriceService = new MarketPriceService();