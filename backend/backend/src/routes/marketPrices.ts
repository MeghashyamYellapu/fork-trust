import express from 'express';
import { marketPriceService } from '../services/marketPriceService.js';

const router = express.Router();

// GET /api/market-prices - Get all market prices (defaults to ODISHA)
router.get('/', async (req, res) => {
  try {
    const { state = 'ODISHA' } = req.query;
    const marketPrices = await marketPriceService.fetchMarketPricesByState(state as string);
    res.json({
      success: true,
      data: marketPrices,
      state: state,
      message: `Market prices for ${state} fetched successfully`
    });
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices'
    });
  }
});

// GET /api/market-prices/state/:stateName - Get market prices for specific state
router.get('/state/:stateName', async (req, res) => {
  try {
    const { stateName } = req.params;
    const marketPrices = await marketPriceService.fetchMarketPricesByState(stateName);
    
    res.json({
      success: true,
      data: marketPrices,
      state: stateName,
      message: `Market prices for ${stateName} fetched successfully`
    });
  } catch (error) {
    console.error(`Error fetching market prices for ${req.params.stateName}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch market prices for ${req.params.stateName}`
    });
  }
});

// GET /api/market-prices/crop/:cropName - Get price for specific crop
router.get('/crop/:cropName', async (req, res) => {
  try {
    const { cropName } = req.params;
    const price = await marketPriceService.getPriceForCrop(cropName);
    
    if (!price) {
      return res.status(404).json({
        success: false,
        message: `Price not found for crop: ${cropName}`
      });
    }

    res.json({
      success: true,
      data: price,
      message: `Price for ${cropName} fetched successfully`
    });
  } catch (error) {
    console.error('Error fetching crop price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop price'
    });
  }
});

// GET /api/market-prices/crops - Get prices for multiple crops
router.get('/crops', async (req, res) => {
  try {
    const { crops } = req.query;
    
    if (!crops) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crops parameter (comma-separated list)'
      });
    }

    const cropsList = (crops as string).split(',').map(crop => crop.trim());
    const prices = await marketPriceService.getPricesForCrops(cropsList);

    res.json({
      success: true,
      data: prices,
      message: `Prices for requested crops fetched successfully`
    });
  } catch (error) {
    console.error('Error fetching crops prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops prices'
    });
  }
});

// POST /api/market-prices/refresh - Refresh market prices cache
router.post('/refresh', async (req, res) => {
  try {
    await marketPriceService.refreshCache();
    const freshPrices = await marketPriceService.fetchLiveMarketPrices();
    
    res.json({
      success: true,
      data: freshPrices,
      message: 'Market prices cache refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing market prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh market prices'
    });
  }
});

export default router;