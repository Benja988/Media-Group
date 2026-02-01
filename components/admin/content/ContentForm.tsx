'use client';

import React, { useState, useEffect } from 'react';
import { ContentCreateDto, ContentUpdateDto } from '@/types/content.types';
import TinyMCEWrapper from '@/components/editor/TinyMCEWrapper';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

interface ContentFormProps {
  formData: ContentCreateDto | ContentUpdateDto;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isEdit?: boolean;
  categories?: Array<{ _id: string; name: string; slug: string }>;
  tags?: Array<{ _id: string; name: string; slug: string }>;
  stations?: Array<{ _id: string; name: string; slug: string }>;
  channels?: Array<{ _id: string; name: string; slug: string; stationId: string }>;
}

export default function ContentForm({
  formData,
  onChange,
  onSubmit,
  loading,
  isEdit = false,
  categories = [],
  tags = [],
  stations = [],
  channels = []
}: ContentFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(formData.categoryIds) ? formData.categoryIds : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    Array.isArray(formData.tagIds) ? formData.tagIds : []
  );
  const [newTag, setNewTag] = useState('');
  const [slugError, setSlugError] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle title change with auto-slug generation
  const handleTitleChange = (value: string) => {
    onChange('title', value);

    // Auto-generate slug if not manually modified
    if (!formData.slug || formData.slug === generateSlug(formData.title || '')) {
      const newSlug = generateSlug(value);
      onChange('slug', newSlug);
      checkSlugAvailability(newSlug);
    }
  };

  // Check slug availability
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      setSlugError('');
      return;
    }

    try {
      const response = await fetch(`/api/content/slug/${slug}?checkAvailability=true`);
      if (response.ok) {
        setSlugAvailable(true);
        setSlugError('');
      } else if (response.status === 409) {
        setSlugAvailable(false);
        setSlugError('This slug is already in use');
      }
    } catch (error) {
      console.error('Error checking slug availability:', error);
    }
  };

  // Handle slug change
  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    onChange('slug', slug);
    checkSlugAvailability(slug);
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    onChange('categoryIds', newCategories);
  };

  // Handle tag selection
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newTags);
    onChange('tagIds', newTags);
  };

  // Add new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      // In a real app, you would create the tag via API
      // For now, we'll simulate it
      const tagName = newTag.trim();
      const newTagObj = {
        _id: `temp-${Date.now()}`,
        name: tagName,
        slug: generateSlug(tagName)
      };

      // Add to selected tags
      const newTags = [...selectedTags, newTagObj._id];
      setSelectedTags(newTags);
      onChange('tagIds', newTags);

      // Add to local tags array (in a real app, this would come from API)
      // tags.push(newTagObj);

      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken'); // or wherever you store it

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange('thumbnailUrl', data.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };


  // Filter channels based on selected station
  const filteredChannels = formData.stationId
    ? channels.filter(channel => channel.stationId === formData.stationId)
    : channels;

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter content title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL Slug *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10 ${slugAvailable === false
                      ? 'border-red-300 dark:border-red-700'
                      : slugAvailable === true
                        ? 'border-green-300 dark:border-green-700'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="url-slug"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {slugAvailable === true && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {slugAvailable === false && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              {slugError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {slugError}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This will be used in the URL: /content/{formData.slug}
              </p>
            </div>
          </div>

          {/* Content Type */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'news', label: 'News Article', icon: '📰' },
                { value: 'podcast', label: 'Podcast', icon: '🎙️' },
                { value: 'video', label: 'Video', icon: '🎬' },
                { value: 'show', label: 'TV/Radio Show', icon: '📺' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onChange('type', type.value)}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${formData.type === type.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                >
                  <span className="text-2xl mb-2">{type.icon}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Content *
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description / Content
            </label>
            <TinyMCEWrapper
              value={formData.description || ''}
              onChange={(value) => onChange('description', value)}
              height={400}
              placeholder="Write your content here..."
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail Image
            </label>
            <div className="flex items-center space-x-4">
              {formData.thumbnailUrl ? (
                <>
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => onChange('thumbnailUrl', '')}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {formData.thumbnailUrl}
                    </p>
                  </div>
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="thumbnail-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload thumbnail
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              )}
              {uploadingImage && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Media URL and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Media URL
              </label>
              <input
                type="url"
                value={formData.mediaUrl || ''}
                onChange={(e) => onChange('mediaUrl', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                min="0"
                value={formData.duration || ''}
                onChange={(e) => onChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="360"
              />
            </div>
          </div>
        </div>

        {/* Categories and Tags */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Categorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Categories
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category._id}`}
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${category._id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No categories available</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tags
              </label>

              {/* Tag Input */}
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add new tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map(tagId => {
                  const tag = tags.find(t => t._id === tagId);
                  return tag ? (
                    <span
                      key={tag._id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tag._id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>

              {/* Available Tags */}
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                {tags.filter(tag => !selectedTags.includes(tag._id)).map((tag) => (
                  <div key={tag._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`tag-${tag._id}`}
                      checked={selectedTags.includes(tag._id)}
                      onChange={() => handleTagToggle(tag._id)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <label
                      htmlFor={`tag-${tag._id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No tags available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Distribution
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Station */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Station
              </label>
              <select
                value={formData.stationId || ''}
                onChange={(e) => onChange('stationId', e.target.value || undefined)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a station (optional)</option>
                {stations.map((station) => (
                  <option key={station._id} value={station._id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Channel
              </label>
              <select
                value={formData.channelId || ''}
                onChange={(e) => onChange('channelId', e.target.value || undefined)}
                disabled={!formData.stationId}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="">Select a channel (optional)</option>
                {filteredChannels.map((channel) => (
                  <option key={channel._id} value={channel._id}>
                    {channel.name}
                  </option>
                ))}
              </select>
              {!formData.stationId && (
                <p className="mt-1 text-xs text-gray-500">
                  Select a station first to see available channels
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}