'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Filter,
  Download,
  BarChart3,
  LineChart
} from 'lucide-react';
import EngagementLeaderboard from '@/components/admin/engagement/EngagementLeaderboard';
import EngagementMetrics from '@/components/admin/engagement/EngagementMetrics';

export default function EngagementDashboard() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalEngagements: 0,
    dailyAverage: 0,
    peakHour: '14:00',
    topContentType: 'news',
    engagementRate: 5.2
  });

  useEffect(() => {
    fetchLeaderboard();
    fetchMetrics();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/engagement/leaderboard?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    // In a real app, you would fetch metrics from your API
    // For now, using mock data
    setMetrics({
      totalEngagements: 12543,
      dailyAverage: 896,
      peakHour: '14:00',
      topContentType: 'news',
      engagementRate: 5.2
    });
  };

  const exportData = () => {
    // Implement data export functionality
    const data = {
      leaderboard,
      metrics,
      timeframe,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `engagement-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Engagement Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor user interactions and content performance across your platform
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics Period
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mr-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engagements</h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalEngagements.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15.3% from last period
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Average</h3>
            <Calendar className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.dailyAverage.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.7% from last period
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Peak Hour</h3>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.peakHour}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            2 PM - 4 PM peak time
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Content Type</h3>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {metrics.topContentType}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            42% of total engagements
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</h3>
            <LineChart className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.engagementRate}%
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +2.1% from last period
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Content
            </h3>
            <div className="flex space-x-2">
              <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="all">All Types</option>
                <option value="likes">Likes</option>
                <option value="comments">Comments</option>
                <option value="shares">Shares</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <EngagementLeaderboard data={leaderboard} />
          )}
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Engagement Breakdown
          </h3>
          <EngagementMetrics timeframe={timeframe} />
        </div>
      </div>

      {/* Engagement Types Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Engagement Types Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">12.5K</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5%</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <ThumbsUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">3.2K</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">+8.7%</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">856</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">+5.3%</div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <Share2 className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">324</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Shares</p>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">+3.2%</div>
          </div>
        </div>
      </div>

      {/* User Engagement Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          User Engagement Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Active Users</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">2.5K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Daily active users</div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avg. Session Duration</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">4m 32s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Per user session</div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Return Rate</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">68%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Users return within 7 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}