'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TimelineData {
  _id: number;
  engagements: Array<{
    type: string;
    count: number;
  }>;
  total: number;
}

interface EngagementTimelineProps {
  data: TimelineData[];
}

export default function EngagementTimeline({ data }: EngagementTimelineProps) {
  // Transform data for the chart
  const chartData = data.map(item => {
    const hour = item._id;
    const hourData: any = {
      hour: `${hour}:00`,
      total: item.total
    };
    
    // Add each engagement type as separate data point
    item.engagements.forEach(engagement => {
      hourData[engagement.type] = engagement.count;
    });
    
    return hourData;
  });

  // Get unique engagement types for lines
  const engagementTypes = Array.from(
    new Set(
      data.flatMap(item => 
        item.engagements.map(e => e.type)
      )
    )
  );

  // Color mapping for engagement types
  const colorMap = {
    like: '#10B981', // green
    comment: '#8B5CF6', // purple
    share: '#F59E0B', // yellow
    view: '#3B82F6' // blue
  };

  // Format hour for display
  const formatHour = (hour: string) => {
    const hourNum = parseInt(hour.split(':')[0]);
    return hourNum >= 12 
      ? `${hourNum === 12 ? 12 : hourNum - 12}PM` 
      : `${hourNum === 0 ? 12 : hourNum}AM`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <Legend />
            
            {/* Total line */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6B7280"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Total"
            />
            
            {/* Individual engagement type lines */}
            {engagementTypes.map(type => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={colorMap[type as keyof typeof colorMap] || '#6B7280'}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name={type.charAt(0).toUpperCase() + type.slice(1)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">No timeline data available</div>
            <div className="text-sm text-gray-500">
              Engagement data will appear here once users interact with content
            </div>
          </div>
        </div>
      )}
    </div>
  );
}