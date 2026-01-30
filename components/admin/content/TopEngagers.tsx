'use client';

import React from 'react';
import { Users, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';

interface TopEngager {
  userId: string;
  name: string;
  engagementCount: number;
  engagementTypes: string[];
}

interface TopEngagersProps {
  users: TopEngager[];
}

export default function TopEngagers({ users }: TopEngagersProps) {
  // Sort users by engagement count
  const sortedUsers = [...users].sort((a, b) => b.engagementCount - a.engagementCount);

  // Get icon for engagement type
  const getEngagementIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'like': return <ThumbsUp className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  // Get color for engagement type
  const getEngagementColor = (type: string) => {
    switch (type) {
      case 'comment': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
      case 'like': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'share': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      default: return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
    }
  };

  return (
    <div className="space-y-4">
      {sortedUsers.length > 0 ? (
        sortedUsers.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {index + 1}
                </span>
                <span className="text-xs text-gray-500">Rank</span>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {user.userId.substring(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Engagement Info */}
            <div className="flex items-center space-x-4">
              {/* Engagement Types */}
              <div className="flex space-x-1">
                {user.engagementTypes.map((type, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-full ${getEngagementColor(type)}`}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                  >
                    {getEngagementIcon(type)}
                  </div>
                ))}
              </div>

              {/* Engagement Count */}
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.engagementCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Engagements
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No top engagers yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            User engagement data will appear here once users start interacting
          </p>
        </div>
      )}
    </div>
  );
}