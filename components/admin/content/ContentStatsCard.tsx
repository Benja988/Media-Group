'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface ContentStatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  trend?: number;
  trendLabel?: string;
}

export default function ContentStatsCard({
  title,
  value,
  icon,
  description,
  color = 'blue',
  trend,
  trendLabel
}: ContentStatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${colors.icon}`}>
          {icon}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>

      {trend !== undefined && (
        <div className="flex items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {trend >= 0 ? (
            <TrendingUp className={`h-4 w-4 ${colors.text} mr-2`} />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
          )}
          <span className={`text-sm font-medium ${
            trend >= 0 ? colors.text : 'text-red-500 dark:text-red-400'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {trendLabel || 'from last month'}
          </span>
        </div>
      )}
    </div>
  );
}