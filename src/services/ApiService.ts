// src/services/ApiService.ts

export interface CurrentData {
  timestamp: string;
  temperature: number;
  humidity: number;
  windspeed: number;
  pressure: number;
}

export interface ForecastData {
  [key: string]: number[]; 
}

export interface ModelMetric {
  name: string;
  accuracy: number;
  mae: number;
  rmse: number;
}

export interface MultiPrediction {
  predictions: [string, number][]; // timestamp and predicted pm2.5
}

export interface SinglePrediction {
  pm25_prediction: number;
}


const BASE_URL = "http://127.0.0.1:8000/api";

export async function getCurrentData() {
  const res = await fetch(`${BASE_URL}/current`);
  if (!res.ok) throw new Error("Failed to fetch current data");
  return res.json();
}

export async function getForecastData() {
  const res = await fetch(`${BASE_URL}/forecast`);
  if (!res.ok) throw new Error("Failed to fetch forecast data");
  return res.json();
}

export async function getModelMetrics() {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) throw new Error("Failed to fetch model metrics");
  return res.json();
}
export async function getPrediction(modelName: string) {
  const res = await fetch(`${BASE_URL}/predict/${modelName}`);
  if (!res.ok) throw new Error(`Failed to fetch prediction for model ${modelName}`);
  return res.json();
}




