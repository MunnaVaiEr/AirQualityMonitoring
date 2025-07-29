import { addHours, format } from 'date-fns';
import { CurrentData, ForecastData, ModelMetrics } from '../types';
import { getAQIStatus, calculateAQI } from './airQuality';


const generatePM25 = (baseValue: number = 52, variance: number = 18): number => {
  
  const seasonalFactor = Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI) * 15;
  const dailyPattern = Math.sin(Date.now() / (1000 * 60 * 60 * 24) * 2 * Math.PI) * 10;
  
  return Math.max(8, baseValue + seasonalFactor + dailyPattern + (Math.random() - 0.5) * variance * 2);
};

export const generateCurrentData = (): CurrentData => {
 
  const sensorReadings = Array.from({ length: 5 }, () => generatePM25());
  const pm25 = sensorReadings.reduce((sum, reading) => sum + reading, 0) / sensorReadings.length;
  
  const aqi = calculateAQI(pm25);
  const status = getAQIStatus(pm25);

  return {
    airQuality: {
      pm25: Math.round(pm25 * 10) / 10,
      aqi,
      status,
      timestamp: new Date().toISOString()
    },
    weather: {
      // Weather data would come from Meteostat API in production
      temperature: Math.round((18 + Math.random() * 12) * 10) / 10, // Kathmandu typical range
      humidity: Math.round((45 + Math.random() * 35) * 10) / 10,
      windSpeed: Math.round((1 + Math.random() * 6) * 10) / 10, // Generally low wind in valley
      pressure: Math.round((1008 + Math.random() * 15) * 10) / 10, // Adjusted for altitude
      timestamp: new Date().toISOString()
    }
  };
};

export const generateForecastData = (): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  
  // Generate hourly data for the next 24 hours
  for (let i = 0; i < 24; i++) {
    const timestamp = addHours(now, i);
    const hour = timestamp.getHours();
    
    // Kathmandu pollution patterns: higher in morning (7-10) and evening (18-22)
    let basePM25 = 45;
    if (hour >= 7 && hour <= 10) basePM25 += 15; // Morning traffic
    if (hour >= 18 && hour <= 22) basePM25 += 20; // Evening traffic + cooking
    if (hour >= 23 || hour <= 5) basePM25 -= 10; // Night time reduction
    
    const pm25 = generatePM25(basePM25, 12);
    const aqi = calculateAQI(pm25);
    const status = getAQIStatus(pm25);
    
    data.push({
      timestamp: timestamp.toISOString(),
      pm25: Math.round(pm25 * 10) / 10,
      aqi,
      status
    });
  }
  
  return data;
};

export const modelMetrics: ModelMetrics[] = [
  {
    name: 'Random Forest Regressor',
    mae: 4.78,
    rmse: 6.58,
    r2: 0.91,
    description: 'Random Forest Regressor neural network, optimized for Open-Meteo temporal patterns'
  },
  {
    name: 'Linear Regression',
    mae: 4.85,
    rmse: 6.89,
    r2: 0.90,
    description: 'Linear Regression, captures daily and seasonal pollution cycles in Kathmandu'
  },
  {
    name: 'XGBoost',
    mae: 5.10,
    rmse: 6.79,
    r2: 0.90,
    description: 'XGBoost baseline model with Open-Meteo sensor data'
  },
  {
    name: 'Multiple Linear Regression',
    mae: 10.8,
    rmse: 15.9,
    r2: 0.69,
    description: 'Multiple regression with weather, traffic, and temporal features from Open-Meteo data'
  },
  {
    name: 'ARIMA',
    mae: 11.5,
    rmse: 16.8,
    r2: 0.64,
    description: 'AutoRegressive model for trend analysis using Open-Meteo historical data'
  },
  
];
// Utility function to simulate network delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));