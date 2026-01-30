'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Calendar, 
  BarChart3,
  Share2,
  ThumbsUp,
  MessageCircle,
  Users,
  Clock,
  FileText,
  Headphones,
  Video,
  Tv
} from 'lucide-react';
import { ContentResponse } from '@/types/content.types';
import { formatDate, formatDuration } from '@/utils/helpers';
import EngagementChart from '@/components/admin/content/EngagementChart';

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;
  
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [engagementStats, setEngagementStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (contentId) {
      fetchContent();
      fetchMetrics();
      fetchEngagementStats();
    }
  }, [contentId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/${contentId}?includeEngagement=true`);
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/content/metrics/${contentId}`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchEngagementStats = async () => {
    try {
      const response = await fetch(`/api/engagement/content/${contentId}/stats`);
      const data = await response.json();
      
      if (data.success) {
        setEngagementStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <FileText className="h-5 w-5" />;
      case 'podcast': return <Headphones className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'show': return <Tv className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Content not found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The content you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/admin/content"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Link>
        </div>
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
              onClick={() => router.push('/admin/content')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {content.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                {getTypeIcon(content.type)}
                <span className="ml-1 capitalize">{content.type}</span>
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ID: {content._id.substring(0, 8)}...
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Created: {formatDate(content.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/admin/content/${contentId}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <a
              href={`/content/${content.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Live
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            {content.thumbnailUrl && (
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {content.description}
                </p>
              </div>
              
              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {content.status}
                    </div>
                  </div>
                  {content.publishedAt && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(content.publishedAt)}
                      </div>
                    </div>
                  )}
                  {content.scheduledFor && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled For</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(content.scheduledFor)}
                      </div>
                    </div>
                  )}
                  {content.duration && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDuration(content.duration)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          {engagementStats && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Engagement Analytics
              </h3>
              <EngagementChart data={engagementStats} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metrics Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h3>
            
            {metrics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {metrics.views.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Likes</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {metrics.likes.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Comments</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {metrics.comments.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Share2 className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Shares</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {metrics.shares.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {metrics.engagementRate}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}
          </div>

          {/* Categories & Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories & Tags
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.categories?.map((category) => (
                    <span
                      key={category._id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs"
                    >
                      {category.name}
                    </span>
                  ))}
                  {(!content.categories || content.categories.length === 0) && (
                    <span className="text-sm text-gray-500 italic">No categories</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.tags?.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {(!content.tags || content.tags.length === 0) && (
                    <span className="text-sm text-gray-500 italic">No tags</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Station & Channel Info */}
          {(content.station || content.channel) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Distribution
              </h3>
              
              <div className="space-y-4">
                {content.station && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Station
                    </h4>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {content.station.name}
                      </span>
                    </div>
                  </div>
                )}

                {content.channel && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Channel
                    </h4>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <Tv className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {content.channel.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}