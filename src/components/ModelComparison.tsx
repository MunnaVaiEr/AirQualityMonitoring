import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ModelMetrics } from '../types';
import { TrendingUp, Target, Activity } from 'lucide-react';

interface ModelComparisonProps {
  models: ModelMetrics[];
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ models }) => {
  const getBestModelBadge = (metric: keyof Pick<ModelMetrics, 'mae' | 'rmse' | 'r2'>, value: number) => {
    const values = models.map(m => m[metric]);
    const isBest = metric === 'r2' 
      ? value === Math.max(...values)
      : value === Math.min(...values);
    
    return isBest ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
        Best
      </span>
    ) : null;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey.toUpperCase()}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Model Performance Comparison</h3>
        <div className="text-sm text-gray-500">Lower MAE/RMSE and higher R² is better</div>
      </div>

      {/* Performance Metrics Chart */}
      <div className="mb-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={models} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="mae" fill="#EF4444" name="MAE" radius={[2, 2, 0, 0]} />
              <Bar dataKey="rmse" fill="#F59E0B" name="RMSE" radius={[2, 2, 0, 0]} />
              <Bar dataKey="r2" fill="#3B82F6" name="R²" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model, index) => (
          <div key={model.name} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{model.name}</h4>
              {index === 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Recommended
                </span>
              )}
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">MAE:</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{model.mae.toFixed(1)}</span>
                  {getBestModelBadge('mae', model.mae)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">RMSE:</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{model.rmse.toFixed(1)}</span>
                  {getBestModelBadge('rmse', model.rmse)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">R²:</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{model.r2.toFixed(2)}</span>
                  {getBestModelBadge('r2', model.r2)}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};