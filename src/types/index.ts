export interface AirQualityData {
  pm25: number;
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  timestamp: string;
}

export interface ForecastData {
  timestamp: string;
  pm25: number;
  aqi: number;
  status: string;
}

export interface ModelMetrics {
  name: string;
  mae: number;
  rmse: number;
  r2: number;
  description: string;
}

export interface CurrentData {
  airQuality: AirQualityData;
  weather: WeatherData;
}

