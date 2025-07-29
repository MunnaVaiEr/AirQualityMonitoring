import { AirQualityData } from '../types';

export const getAQIStatus = (pm25: number): AirQualityData['status'] => {
  if (pm25 <= 12) return 'Good';
  if (pm25 <= 35.4) return 'Moderate';
  if (pm25 <= 55.4) return 'Unhealthy for Sensitive Groups';
  if (pm25 <= 150.4) return 'Unhealthy';
  if (pm25 <= 250.4) return 'Very Unhealthy';
  return 'Hazardous';
};

export const calculateAQI = (pm25: number): number => {
  // EPA AQI calculation formula for PM2.5
  if (pm25 <= 12.0) {
    return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
  } else if (pm25 <= 35.4) {
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  } else if (pm25 <= 55.4) {
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  } else if (pm25 <= 150.4) {
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  } else if (pm25 <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  } else {
    return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
  }
};

export const getStatusColor = (status: AirQualityData['status']): string => {
  switch (status) {
    case 'Good':
      return 'text-green-600 bg-green-50';
    case 'Moderate':
      return 'text-yellow-600 bg-yellow-50';
    case 'Unhealthy for Sensitive Groups':
      return 'text-orange-600 bg-orange-50';
    case 'Unhealthy':
      return 'text-red-600 bg-red-50';
    case 'Very Unhealthy':
      return 'text-purple-600 bg-purple-50';
    case 'Hazardous':
      return 'text-gray-900 bg-gray-200';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusBorderColor = (status: AirQualityData['status']): string => {
  switch (status) {
    case 'Good':
      return 'border-green-200';
    case 'Moderate':
      return 'border-yellow-200';
    case 'Unhealthy for Sensitive Groups':
      return 'border-orange-200';
    case 'Unhealthy':
      return 'border-red-200';
    case 'Very Unhealthy':
      return 'border-purple-200';
    case 'Hazardous':
      return 'border-gray-300';
    default:
      return 'border-gray-200';
  }
};