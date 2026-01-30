'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Download,
  BarChart3,
  LineChart
} from 'lucide-react';
import EngagementTimeline from '@/components/admin/content/EngagementTimeline';
import PopularTimesChart from '@/components/admin/content/PopularTimesChart';
import TopEngagers from '@/components/admin/content/TopEngagers';
export default function ContentAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;
  
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [engagementStats, setEngagementStats] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [metrics, setMetrics] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    engagementRate: 0
  });

  useEffect(() => {
    if (contentId) {
      fetchContent();
      fetchEngagementStats();
      fetchMetrics();
    }
  }, [contentId, timeframe]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/${contentId}`);
      const data = await response.json();
      if (data.success) setContent(data.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchEngagementStats = async () => {
    try {
      const response = await fetch(`/api/engagement/content/${contentId}/stats`);
      const data = await response.json();
      if (data.success) setEngagementStats(data.data);
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/content/metrics/${contentId}`);
      const data = await response.json();
      if (data.success) setMetrics(data.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const exportData = () => {
    // Implement data export functionality
    const data = {
      content,
      metrics,
      engagementStats,
      timeframe
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `content-analytics-${contentId}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push(`/admin/content/${contentId}`)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics for "{content?.title}"
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Detailed engagement and performance metrics
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics Period
          </h3>
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</h3>
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.views.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5% from last period
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</h3>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.engagementRate}%
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +3.2% from last period
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</h3>
            <ThumbsUp className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.likes.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.7% from last period
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</h3>
            <MessageCircle className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.comments.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5.3% from last period
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Engagement Timeline
          </h3>
          {engagementStats?.hourlyTrend ? (
            <EngagementTimeline data={engagementStats.hourlyTrend} />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">No timeline data available</div>
            </div>
          )}
        </div>

        {/* Popular Times */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Peak Engagement Times
          </h3>
          {engagementStats?.hourlyTrend ? (
            <PopularTimesChart data={engagementStats.hourlyTrend} />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">No time data available</div>
            </div>
          )}
        </div>
      </div>

      {/* Top Engagers */}
      {engagementStats?.topEngagingUsers && engagementStats.topEngagingUsers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Engagers
          </h3>
          <TopEngagers users={engagementStats.topEngagingUsers} />
        </div>
      )}

      {/* Engagement Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Engagement Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Engagement Types</h4>
            {engagementStats?.aggregated && Object.entries(engagementStats.aggregated).map(([type, data]: [string, any]) => (
              <div key={type} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}s</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{data.count}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Unique Users</h4>
            {engagementStats?.aggregated && Object.entries(engagementStats.aggregated).map(([type, data]: [string, any]) => (
              <div key={type} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}s</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{data.uniqueUsers}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">User Distribution</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>New Users</span>
                  <span>65%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Returning Users</span>
                  <span>35%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}