/**
 * Traffic API Routes
 * Handles requests for foot traffic data
 */

const express = require('express');
const router = express.Router();
const densityGridGenerator = require('../services/densityGridGenerator');

// Cache for generated data
let densityCache = new Map();

/**
 * GET /api/traffic/density
 * Get seamless density grid data for heatmap visualization
 * Query params: hour (0-23), day (0-6), minute (0-59), resolution (low/medium/high/ultra/extreme)
 * Now supports minute-level precision for smooth animations!
 */
router.get('/density', async (req, res) => {
  try {
    const hour = parseInt(req.query.hour) || 14;
    const day = parseInt(req.query.day) || 5;
    const minute = parseInt(req.query.minute) || 0;
    const resolution = req.query.resolution || 'high';
    
    // Validate parameters
    if (hour < 0 || hour > 23) {
      return res.status(400).json({ error: 'Hour must be between 0 and 23' });
    }
    if (day < 0 || day > 6) {
      return res.status(400).json({ error: 'Day must be between 0 (Sunday) and 6 (Saturday)' });
    }
    if (minute < 0 || minute > 59) {
      return res.status(400).json({ error: 'Minute must be between 0 and 59' });
    }
    
    // For minute-level data, we use a shorter cache or no cache for real-time feel
    // Cache by 5-minute intervals to balance performance and smoothness
    const cacheMinute = Math.floor(minute / 5) * 5;
    const cacheKey = `density-${day}-${hour}-${cacheMinute}-${resolution}`;
    
    // Check cache
    if (densityCache.has(cacheKey)) {
      const cachedData = densityCache.get(cacheKey);
      // Return cached data but update minute in metadata
      return res.json({
        ...cachedData,
        metadata: { ...cachedData.metadata, minute, actualCacheMinute: cacheMinute }
      });
    }
    
    // Generate density grid data with minute precision
    const data = densityGridGenerator.generateParisDensityData(hour, day, cacheMinute, resolution);
    
    // Cache the result
    densityCache.set(cacheKey, data);
    
    // Limit cache size to prevent memory issues
    if (densityCache.size > 500) {
      const firstKey = densityCache.keys().next().value;
      densityCache.delete(firstKey);
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('Error generating density data:', error);
    res.status(500).json({ error: 'Failed to generate density data' });
  }
});

module.exports = router;
