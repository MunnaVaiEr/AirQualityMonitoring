import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge,
  MapPin,
  RefreshCw,
  Clock,
  Heart,
  Users,
  Shield,
  Stethoscope,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { CurrentData, ForecastData} from '../types';
import { getCurrentData, getForecastData } from '../services/ApiService';

import { MetricCard } from './MetricCard';
import { AirQualityStatus } from './AirQualityStatus';
import { ForecastChart } from './ForecastChart';
import { LoadingSpinner } from './LoadingSpinner';
import { format } from 'date-fns';
import AboutPM25 from './AboutPm';
import Innovators from './Innovators';
import { ModelMetrics } from '../types';






export const Dashboard: React.FC = () => {
  const [currentData, setCurrentData] = useState<CurrentData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());




const fetchData = async () => {
  try {
    setLoading(true);
    const [current, forecast] = await Promise.all([
      getCurrentData(),
      getForecastData()
    ]);
    console.log("Forecast data:", forecast);

    setCurrentData(current);
    setForecastData(forecast);
    setLastUpdated(new Date());
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
    fetchData();
    
    // Set up interval to refresh data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Health advice functions
  const getHealthAdvice = (status: string, pm25: number) => {
    const baseAdvice = {
      general: '',
      sensitive: '',
      activities: '',
      protection: '',
      icon: Heart,
      urgency: 'low' as 'low' | 'medium' | 'high' | 'critical'
    };

    switch (status) {
      case 'Good':
        return {
          ...baseAdvice,
          general: 'Air quality is ideal for outdoor activities. No health concerns for the general population.',
          sensitive: 'Even sensitive individuals can enjoy normal outdoor activities.',
          activities: 'Perfect conditions for jogging, cycling, outdoor sports, and children\'s play.',
          protection: 'No protective measures needed. Enjoy the fresh air!',
          icon: Shield,
          urgency: 'low' as const
        };

      case 'Moderate':
        return {
          ...baseAdvice,
          general: 'Air quality is acceptable for most people. Unusually sensitive individuals may experience minor symptoms.',
          sensitive: 'People with respiratory or heart conditions should consider reducing prolonged outdoor exertion.',
          activities: 'Normal outdoor activities are fine. Sensitive individuals may want to limit intense exercise.',
          protection: 'Consider wearing a mask if you have respiratory sensitivities during extended outdoor activities.',
          icon: Heart,
          urgency: 'low' as const
        };

      case 'Unhealthy for Sensitive Groups':
        return {
          ...baseAdvice,
          general: 'Most people can continue normal activities, but may notice minor irritation.',
          sensitive: 'Children, elderly, and people with heart/lung conditions should limit outdoor activities.',
          activities: 'Reduce prolonged outdoor exertion. Move intense activities indoors or reschedule.',
          protection: 'Sensitive groups should wear N95 masks outdoors. Close windows and use air purifiers indoors.',
          icon: Users,
          urgency: 'medium' as const
        };

      case 'Unhealthy':
        return {
          ...baseAdvice,
          general: 'Everyone may experience health effects. Limit outdoor activities and stay indoors when possible.',
          sensitive: 'Children, elderly, and those with health conditions should avoid outdoor activities entirely.',
          activities: 'Cancel outdoor events. Exercise indoors only. Schools should limit outdoor activities.',
          protection: 'Wear N95 or P100 masks when outdoors. Keep windows closed. Use air purifiers with HEPA filters.',
          icon: AlertTriangle,
          urgency: 'high' as const
        };

      case 'Very Unhealthy':
        return {
          ...baseAdvice,
          general: 'Health alert! Everyone should avoid outdoor activities. Serious health effects possible.',
          sensitive: 'High-risk individuals should remain indoors and seek medical attention if experiencing symptoms.',
          activities: 'All outdoor activities should be cancelled. Work from home if possible. Keep children indoors.',
          protection: 'Essential outdoor travel only. Wear P100 masks. Seal windows and doors. Run air purifiers continuously.',
          icon: Stethoscope,
          urgency: 'critical' as const
        };

      case 'Hazardous':
        return {
          ...baseAdvice,
          general: 'Emergency conditions! Entire population at risk. Stay indoors and avoid all outdoor exposure.',
          sensitive: 'Seek immediate medical attention if experiencing breathing difficulties, chest pain, or severe symptoms.',
          activities: 'All outdoor activities prohibited. Emergency services may be limited. Shelter in place.',
          protection: 'Do not go outside unless absolutely necessary. Use P100 masks for essential travel. Create clean air rooms.',
          icon: AlertTriangle,
          urgency: 'critical' as const
        };

      default:
        return {
          ...baseAdvice,
          general: 'Air quality data unavailable. Exercise caution.',
          sensitive: 'Sensitive individuals should limit outdoor exposure until data is available.',
          activities: 'Consider postponing outdoor activities until air quality improves.',
          protection: 'Monitor air quality updates and follow local health advisories.',
          icon: Heart,
          urgency: 'medium' as const
        };
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getSymptomWarnings = (pm25: number) => {
    if (pm25 <= 12) return [];
    if (pm25 <= 35.4) return ['Mild eye irritation possible for sensitive individuals'];
    if (pm25 <= 55.4) return ['Eye and throat irritation', 'Coughing in sensitive individuals', 'Fatigue possible'];
    if (pm25 <= 150.4) return ['Coughing and throat irritation', 'Shortness of breath', 'Chest discomfort', 'Fatigue and headaches'];
    if (pm25 <= 250.4) return ['Severe respiratory symptoms', 'Chest pain', 'Difficulty breathing', 'Heart palpitations', 'Severe fatigue'];
    return ['Emergency symptoms possible', 'Severe breathing difficulties', 'Chest pain', 'Heart problems', 'Seek immediate medical attention'];
  };

  if (loading && !currentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading air quality data from PurpleAir...</p>
        </div>
      </div>
    );
  }

 const advice = currentData?.airQuality
  ? getHealthAdvice(currentData.airQuality.status, currentData.airQuality.pm25)
  : null;

  const symptoms = currentData?.airQuality
  ? getSymptomWarnings(currentData.airQuality.pm25)
  : [];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Air Quality Monitor</h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>Kathmandu Valley, Nepal</span>
                  <span className="text-indigo-600 font-semibold">• Open-Meteo Network</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {format(lastUpdated, 'HH:mm:ss')}</span>
                </div>
                <div className="text-xs text-indigo-600 font-medium">Updates every 10 minutes</div>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Current Conditions - Compact Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Air Quality Status */}
          <div className="xl:col-span-2">
            {currentData?.airQuality && <AirQualityStatus data={currentData.airQuality} />}
          </div>
          
          {/* Weather Metrics */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
              {currentData?. weather && (
                <>
                  <MetricCard
                    title="Temperature"
                    value={currentData.weather.temperature}
                    unit="°C"
                    icon={Thermometer}
                    color="red"
                  />
                  <MetricCard
                    title="Humidity"
                    value={currentData.weather.humidity}
                    unit="%"
                    icon={Droplets}
                    color="blue"
                  />
                  <MetricCard
                    title="Wind Speed"
                    value={currentData.weather.windSpeed}
                    unit="m/s"
                    icon={Wind}
                    color="green"
                  />
                  <MetricCard
                    title="Pressure"
                    value={currentData.weather.pressure}
                    unit="hPa"
                    icon={Gauge}
                    color="purple"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Health Advisory Sections - Improved Grid */}
        {currentData && advice && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Health Advisory */}
            <div className={`rounded-xl p-6 border-2 ${getUrgencyColor(advice.urgency)} shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/50 rounded-lg">
                  <advice.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Health Advisory</h3>
                  {advice.urgency === 'critical' && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full mt-1">
                      EMERGENCY
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed">{advice.general}</p>
            </div>

            {/* Sensitive Groups */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 text-base">Sensitive Groups</h3>
              </div>
              <p className="text-sm text-blue-800 mb-3 leading-relaxed">{advice.sensitive}</p>
              <div className="text-xs text-blue-700 bg-blue-50 p-3 rounded-lg">
                <strong>Includes:</strong> Children, elderly (65+), pregnant women, people with asthma, COPD, heart disease, or diabetes
              </div>
            </div>

            {/* Activity Recommendations */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 text-base">Activity Recommendations</h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">{advice.activities}</p>
            </div>

            {/* Protection Measures */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900 text-base">Protection Measures</h3>
              </div>
              <p className="text-sm text-green-800 leading-relaxed">{advice.protection}</p>
            </div>

            {/* Symptoms to Watch For */}
            {symptoms.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-orange-200 md:col-span-2 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-orange-900 text-base">Symptoms to Watch For</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                  {symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-orange-800 leading-relaxed">{symptom}</span>
                    </div>
                  ))}
                </div>
                {currentData.airQuality.pm25 > 150.4 && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ If experiencing severe symptoms, seek immediate medical attention or call emergency services.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Local Tips for Kathmandu */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-slate-200 hover:shadow-md transition-shadow duration-200 md:col-span-3">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">Local Tips</h3>
              </div>
              <div className="text-sm text-slate-700 space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">Rush hours (7-10 AM, 6-9 PM) have higher pollution</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">Winter months typically show elevated levels</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">HEPA air purifiers recommended indoors</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">Conditions change rapidly - check frequently</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Chart */}
        {forecastData.length > 0 && <ForecastChart data={forecastData} />}

       


        {/* Model Comparison
        {modelMetrics.length > 0 && <ModelComparison models={modelMetrics} />} */}

        

        
        {/* API Integration Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
           
            <h3 className="text-lg font-semibold text-slate-900"> <AboutPM25/></h3>
          </div>
          
          
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">External Data Sources</h4>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-800">Open-Meteo API:</strong> Real-time PM2.5 sensor data</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-800">Meteostat API:</strong> Weather conditions</span>
                </div>
                {/* <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-800">Sensor Network:</strong> Multiple sensors in Kathmandu Valley</span>
                </div> */}
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-800">ML Models:</strong> Linear Regression, Random Forest Regressor, XGBoost Regressor</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-800">Auto-refresh:</strong> Every 10 minutes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-800">Data Quality:</strong> Real-time validation & averaging</span>
                </div>
              </div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
          </div>




          

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-4">Open-Meteo Integration Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-indigo-800">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                  <Clock className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <strong className="block text-indigo-900">High Frequency</strong>
                  <span>Updates every 10 minutes with real-time sensor data</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <strong className="block text-indigo-900">Local Coverage</strong>
                  <span>Dense sensor network in urban areas like Kathmandu</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                  <Shield className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <strong className="block text-indigo-900">Data Quality</strong>
                  <span>Multiple sensors provide averaged, validated readings</span>
                </div>
              </div>
            </div>
          </div>
          <div className="">
          <Innovators/>
        </div>
        </div>
        
      </main>
       {/*Footer */}
    <div className="fixed bottom-0 left-0 w-full text-center text-sm text-white bg-gradient-to-r from-indigo-400 to-purple-500 p-4 shadow-lg">
  &copy; {new Date().getFullYear()} Air Quality Monitor. All rights reserved.
</div>

    </div>
   
  );
};