'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface LeaderboardItem {
  contentId: string;
  title: string;
  type: string;
  thumbnailUrl?: string;
  engagementCount: number;
  lastEngagement: string;
}

interface EngagementLeaderboardProps {
  data: LeaderboardItem[];
}

export default function EngagementLeaderboard({ data }: EngagementLeaderboardProps) {
  const [sortBy, setSortBy] = useState<'engagements' | 'recent'>('engagements');

  // Sort data based on current sort
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'engagements') {
      return b.engagementCount - a.engagementCount;
    } else {
      return new Date(b.lastEngagement).getTime() - new Date(a.lastEngagement).getTime();
    }
  });

  // Get icon for content type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return '📰';
      case 'podcast': return '🎙️';
      case 'video': return '🎬';
      case 'show': return '📺';
      default: return '📄';
    }
  };

  // Format engagement count
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('engagements')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'engagements'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Most Engagements
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'recent'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Most Recent
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {sortedData.length} items
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedData.length > 0 ? (
          sortedData.map((item, index) => (
            <Link
              key={item.contentId}
              href={`/admin/content/${item.contentId}`}
              className="block group"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' :
                      index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                      index === 2 ? 'bg-orange-100 dark:bg-orange-900' :
                      'bg-gray-50 dark:bg-gray-800'
                    }`}>
                      {index < 3 ? (
                        <Trophy className={`h-5 w-5 ${
                          index === 0 ? 'text-yellow-600 dark:text-yellow-400' :
                          index === 1 ? 'text-gray-600 dark:text-gray-400' :
                          'text-orange-600 dark:text-orange-400'
                        }`} />
                      ) : (
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="flex items-center space-x-3">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full capitalize">
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(item.lastEngagement)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCount(item.engagementCount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Engagements
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No engagement data yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Content will appear here once users start engaging
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {sortedData.length > 0 && (
        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {sortedData.reduce((sum, item) => sum + item.engagementCount, 0).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Average
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {Math.round(sortedData.reduce((sum, item) => sum + item.engagementCount, 0) / sortedData.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Top Type
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {(() => {
                const types = sortedData.map(item => item.type);
                const counts: Record<string, number> = {};
                types.forEach(type => counts[type] = (counts[type] || 0) + 1);
                const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                return topType ? topType[0].charAt(0).toUpperCase() + topType[0].slice(1) : 'N/A';
              })()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Items
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {sortedData.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}