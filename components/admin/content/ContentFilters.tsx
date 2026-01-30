'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface ContentFiltersProps {
  filters: {
    type?: string;
    status?: string;
    stationId?: string;
    categoryId?: string;
    tagId?: string;
    authorId?: string;
    channelId?: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function ContentFilters({ filters, onFilterChange }: ContentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [stations, setStations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [channels, setChannels] = useState([]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // In a real app, you would fetch these from your APIs
        const mockStations = [
          { _id: '1', name: 'Main Station' },
          { _id: '2', name: 'News Channel' },
          { _id: '3', name: 'Entertainment' }
        ];
        setStations(mockStations as any);

        const mockCategories = [
          { _id: '1', name: 'News' },
          { _id: '2', name: 'Sports' },
          { _id: '3', name: 'Entertainment' },
          { _id: '4', name: 'Technology' }
        ];
        setCategories(mockCategories as any);

        const mockTags = [
          { _id: '1', name: 'Breaking' },
          { _id: '2', name: 'Exclusive' },
          { _id: '3', name: 'Live' },
          { _id: '4', name: 'Interview' }
        ];
        setTags(mockTags as any);

        const mockChannels = [
          { _id: '1', name: 'News Desk', stationId: '1' },
          { _id: '2', name: 'Sports Center', stationId: '1' },
          { _id: '3', name: 'Tech Talk', stationId: '2' }
        ];
        setChannels(mockChannels as any);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...localFilters, [field]: value };
    
    // Reset dependent filters
    if (field === 'stationId') {
      newFilters.channelId = '';
    }
    
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: '',
      status: '',
      stationId: '',
      categoryId: '',
      tagId: '',
      authorId: '',
      channelId: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setShowFilters(false);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const filteredChannels = localFilters.stationId
    ? (channels as any[]).filter(channel => channel.stationId === localFilters.stationId)
    : channels;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {getActiveFilterCount() > 0 && (
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {/* Filter Dropdown */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Options */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Type
                  </label>
                  <select
                    value={localFilters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="news">News</option>
                    <option value="podcast">Podcast</option>
                    <option value="video">Video</option>
                    <option value="show">Show</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={localFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Station */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Station
                  </label>
                  <select
                    value={localFilters.stationId}
                    onChange={(e) => handleFilterChange('stationId', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Stations</option>
                    {(stations as any[]).map(station => (
                      <option key={station._id} value={station._id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Channel (depends on station) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Channel
                  </label>
                  <select
                    value={localFilters.channelId}
                    onChange={(e) => handleFilterChange('channelId', e.target.value)}
                    disabled={!localFilters.stationId}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">All Channels</option>
                    {filteredChannels.map((channel: any) => (
                      <option key={channel._id} value={channel._id}>
                        {channel.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={localFilters.categoryId}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {(categories as any[]).map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tag
                  </label>
                  <select
                    value={localFilters.tagId}
                    onChange={(e) => handleFilterChange('tagId', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Tags</option>
                    {(tags as any[]).map(tag => (
                      <option key={tag._id} value={tag._id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}