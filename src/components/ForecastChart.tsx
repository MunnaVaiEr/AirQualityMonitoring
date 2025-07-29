import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { ForecastData } from '../types';

interface ForecastChartProps {
  data: ForecastData[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const formatHour = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const getLineColor = (pm25: number): string => {
    if (pm25 <= 12) return '#10B981'; // Good - Green
    if (pm25 <= 35.4) return '#F59E0B'; // Moderate - Yellow
    if (pm25 <= 55.4) return '#F97316'; // USG - Orange
    if (pm25 <= 150.4) return '#EF4444'; // Unhealthy - Red
    if (pm25 <= 250.4) return '#8B5CF6'; // Very Unhealthy - Purple
    return '#6B7280'; // Hazardous - Gray
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{format(new Date(label), 'MMM dd, HH:mm')}</p>
          <p className="text-sm text-blue-600">PM2.5: {data.pm25} μg/m³</p>
          <p className="text-sm text-gray-600">AQI: {data.aqi}</p>
          <p className="text-xs text-gray-500">{data.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">24-Hour PM2.5 Forecast</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Good (0-12)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Moderate (13-35)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Unhealthy (36+)</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatHour}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for different AQI levels */}
            <ReferenceLine y={12} stroke="#10B981" strokeDasharray="5 5" />
            <ReferenceLine y={34} stroke="#F59E0B" strokeDasharray="5 5" />
            <ReferenceLine y={55} stroke="#EF4444" strokeDasharray="5 5" />
            
            <Line 
              type="monotone" 
              dataKey="pm25" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};