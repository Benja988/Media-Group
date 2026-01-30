'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PopularTimesData {
  _id: number;
  total: number;
  engagements: Array<{
    type: string;
    count: number;
  }>;
}

interface PopularTimesChartProps {
  data: PopularTimesData[];
}

export default function PopularTimesChart({ data }: PopularTimesChartProps) {
  // Transform data for the chart
  const chartData = data.map(item => ({
    hour: item._id,
    total: item.total,
    hourLabel: `${item._id}:00`
  })).sort((a, b) => a.hour - b.hour);

  // Find max value for gradient calculation
  const maxValue = Math.max(...chartData.map(item => item.total));

  // Format hour for display
  const formatHour = (hour: number) => {
    return hour >= 12 
      ? `${hour === 12 ? 12 : hour - 12}PM` 
      : `${hour === 0 ? 12 : hour}AM`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hourData = data.find(item => item._id === payload[0].payload.hour);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {formatHour(payload[0].payload.hour)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Engagements: <span className="font-medium">{payload[0].value}</span>
          </p>
          {hourData?.engagements.map((engagement, index) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
              {engagement.type.charAt(0).toUpperCase() + engagement.type.slice(1)}: 
              <span className="font-medium ml-1">{engagement.count}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate color based on value intensity
  const getBarColor = (value: number) => {
    const intensity = value / maxValue;
    
    if (intensity > 0.8) return '#10B981'; // Green for high
    if (intensity > 0.5) return '#3B82F6'; // Blue for medium-high
    if (intensity > 0.3) return '#F59E0B'; // Yellow for medium
    return '#EF4444'; // Red for low
  };

  return (
    <div className="w-full h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tickFormatter={formatHour}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="total"
              name="Engagements"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.total)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">No time data available</div>
            <div className="text-sm text-gray-500">
              Peak engagement times will appear here
            </div>
          </div>
        </div>
      )}
    </div>
  );
}