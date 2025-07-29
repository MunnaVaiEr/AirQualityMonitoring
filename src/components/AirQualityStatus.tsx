import React from 'react';
import { AirQualityData } from '../types';
import { getStatusColor, getStatusBorderColor } from '../utils/airQuality';
import { Activity, Gauge } from 'lucide-react';

interface AirQualityStatusProps {
  data: AirQualityData;
}

export const AirQualityStatus: React.FC<AirQualityStatusProps> = ({ data }) => {
  const statusColor = getStatusColor(data.status);
  const borderColor = getStatusBorderColor(data.status);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 ">
      <div className="flex items-center space-x-3 mb-0">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Activity className="w-6 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Current Air Quality</h3>
      </div>
      
      <div className={`rounded-xl p-1 border-2 ${borderColor} ${statusColor} -mb-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-4xl font-bold opacity-75 block mb-1">PM2.5</span>
              <span className="text-2xl font-medium leading-none">{data.pm25} μg/m³</span>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Gauge className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold">{data.status}</div>
            <div className="text-sm opacity-75"></div>
          </div>
        </div>
      </div>

      
    </div>
  );
};