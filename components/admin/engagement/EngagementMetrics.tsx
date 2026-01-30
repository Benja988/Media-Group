'use client';

import React, { useState, useEffect } from 'react';
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

interface EngagementMetricsProps {
  timeframe: 'day' | 'week' | 'month';
}

interface MetricsData {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  total: number;
}

export default function EngagementMetrics({ timeframe }: EngagementMetricsProps) {
  const [data, setData] = useState<MetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'total' | 'views' | 'likes' | 'comments' | 'shares'>('total');

  // Generate mock data based on timeframe
  useEffect(() => {
    setLoading(true);
    
    // Generate dates based on timeframe
    const generateDates = () => {
      const dates = [];
      const now = new Date();
      
      if (timeframe === 'day') {
        // Last 24 hours in 4-hour intervals
        for (let i = 23; i >= 0; i -= 4) {
          const date = new Date(now);
          date.setHours(now.getHours() - i);
          dates.push(date);
        }
      } else if (timeframe === 'week') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          dates.push(date);
        }
      } else {
        // Last 30 days in weekly intervals
        for (let i = 4; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - (i * 7));
          dates.push(date);
        }
      }
      
      return dates;
    };

    // Generate mock data
    const generateData = () => {
      const dates = generateDates();
      return dates.map(date => {
        const base = timeframe === 'day' ? 100 : timeframe === 'week' ? 500 : 2000;
        const views = Math.floor(base * (0.8 + Math.random() * 0.4));
        const likes = Math.floor(views * (0.05 + Math.random() * 0.1));
        const comments = Math.floor(views * (0.02 + Math.random() * 0.05));
        const shares = Math.floor(views * (0.01 + Math.random() * 0.03));
        
        return {
          date: timeframe === 'day' 
            ? date.getHours() + ':00'
            : timeframe === 'week'
            ? date.toLocaleDateString('en-US', { weekday: 'short' })
            : `Week ${Math.floor(date.getDate() / 7) + 1}`,
          views,
          likes,
          comments,
          shares,
          total: views + likes + comments + shares
        };
      });
    };

    // Simulate API delay
    setTimeout(() => {
      setData(generateData());
      setLoading(false);
    }, 300);
  }, [timeframe]);

  // Format metric value
  const formatMetric = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
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
              {entry.name}: <span className="font-medium">{formatMetric(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Metric colors
  const metricColors = {
    total: '#6B7280',
    views: '#3B82F6',
    likes: '#10B981',
    comments: '#8B5CF6',
    shares: '#F59E0B'
  };

  // Metric options
  const metricOptions = [
    { key: 'total', label: 'Total Engagements', color: metricColors.total },
    { key: 'views', label: 'Views', color: metricColors.views },
    { key: 'likes', label: 'Likes', color: metricColors.likes },
    { key: 'comments', label: 'Comments', color: metricColors.comments },
    { key: 'shares', label: 'Shares', color: metricColors.shares }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2">
        {metricOptions.map(option => (
          <button
            key={option.key}
            onClick={() => setSelectedMetric(option.key as any)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedMetric === option.key
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            style={{
              border: selectedMetric === option.key ? `2px solid ${option.color}` : '2px solid transparent'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={formatMetric}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey={selectedMetric}
              name={metricOptions.find(m => m.key === selectedMetric)?.label}
              radius={[4, 4, 0, 0]}
              fill={metricColors[selectedMetric]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={metricColors[selectedMetric]}
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metricOptions.map(option => {
          const total = data.reduce((sum, item) => sum + (item as any)[option.key], 0);
          const avg = total / data.length;
          
          return (
            <div
              key={option.key}
              className={`p-3 rounded-lg border ${
                selectedMetric === option.key
                  ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {option.label}
              </div>
              <div className="text-lg font-bold" style={{ color: option.color }}>
                {formatMetric(total)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Avg: {formatMetric(avg)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}