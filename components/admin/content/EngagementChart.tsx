'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface EngagementData {
  aggregated: Record<string, {
    count: number;
    uniqueUsers: number;
  }>;
  hourlyTrend?: any[];
  topEngagingUsers?: any[];
  updatedAt: Date;
}

interface EngagementChartProps {
  data: EngagementData;
}

export default function EngagementChart({ data }: EngagementChartProps) {
  // Transform aggregated data for pie chart
  const pieData = Object.entries(data.aggregated || {}).map(([type, stats]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: stats.count,
    uniqueUsers: stats.uniqueUsers
  }));

  // Color palette
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unique Users: <span className="font-medium">{data.uniqueUsers}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Percentage: <span className="font-medium">
              {((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total engagements
  const totalEngagements = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full">
      {pieData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                //   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                label={({ name, percent }) => {
  const pct = percent !== undefined ? percent : 0;
  return `${name}: ${(pct * 100).toFixed(0)}%`;
}}

                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Breakdown */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Engagement Breakdown
              </h4>
              <div className="space-y-3">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((item.value / totalEngagements) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalEngagements.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Total Engagements
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Object.keys(data.aggregated || {}).length}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Engagement Types
                </div>
              </div>
            </div>

            {/* Average per user */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                Average Engagements per User
              </div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {(() => {
                  const totalUsers = pieData.reduce((sum, item) => sum + item.uniqueUsers, 0);
                  return totalUsers > 0 
                    ? (totalEngagements / totalUsers).toFixed(1)
                    : '0.0';
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 mb-2">No engagement data available</div>
            <div className="text-sm text-gray-500">
              Engagement metrics will appear here once users interact with content
            </div>
          </div>
        </div>
      )}
    </div>
  );
}