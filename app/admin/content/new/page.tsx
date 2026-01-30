'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar,
  Upload,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { ContentCreateDto } from '@/types/content.types';
import ContentForm from '@/components/admin/content/ContentForm';
import { generateSlug } from '@/utils/helpers';

type BaseOption = {
  _id: string;
  name: string;
};


export default function NewContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<ContentCreateDto>({
    type: 'news',
    title: '',
    description: '',
    status: 'draft',
    categoryIds: [],
    tagIds: []
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [stations, setStations] = useState([]);
  const [channels, setChannels] = useState([]);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) setCategories(categoriesData.data);

        // Fetch tags
        const tagsRes = await fetch('/api/tags');
        const tagsData = await tagsRes.json();
        if (tagsData.success) setTags(tagsData.data);

        // Fetch stations
        const stationsRes = await fetch('/api/stations');
        const stationsData = await stationsRes.json();
        if (stationsData.success) setStations(stationsData.data);

        // Fetch channels
        const channelsRes = await fetch('/api/channels');
        const channelsData = await channelsRes.json();
        if (channelsData.success) setChannels(channelsData.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title?.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.slug?.trim()) {
      alert('Slug is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/admin/content/${data.data._id}`);
      } else {
        if (data.error.includes('already exists')) {
          alert('A content item with this slug already exists. Please choose a different slug.');
        } else {
          alert(data.error || 'Failed to create content');
        }
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  // Generate preview HTML
  const renderPreview = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {/* Thumbnail */}
          {formData.thumbnailUrl && (
            <div className="mb-8">
              <img
                src={formData.thumbnailUrl}
                alt={formData.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6">{formData.title || 'Untitled Content'}</h1>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <span className="capitalize bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {formData.type}
            </span>
            <span>•</span>
            <span className="capitalize">{formData.status}</span>
            {formData.duration && (
              <>
                <span>•</span>
                <span>{Math.floor(formData.duration / 60)}:{String(formData.duration % 60).padStart(2, '0')}</span>
              </>
            )}
          </div>

          {/* Content */}
          <div 
            className="content-preview"
            dangerouslySetInnerHTML={{ 
              __html: formData.description || '<p class="text-gray-500 italic">No content provided</p>' 
            }}
          />

          {/* Media */}
          {formData.mediaUrl && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Media</h3>
              <a 
                href={formData.mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {formData.mediaUrl}
              </a>
            </div>
          )}

          {/* Categories and Tags */}
          {(formData.categoryIds?.length || formData.tagIds?.length) && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {formData.categoryIds?.map(catId => {
                  const category = categories.find((c: any) => c._id === catId);
                  return category ? (
                    <span
                      key={catId}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ) : null;
                })}
                {formData.tagIds?.map(tagId => {
                  const tag = tags.find((t: any) => t._id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/content')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Content
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Content</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add new content to your media platform
        </p>
      </div>

      {/* Warning for required fields */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
          <div className="text-sm text-yellow-700 dark:text-yellow-300">
            <p className="font-medium">Required fields:</p>
            <ul className="mt-1 list-disc list-inside">
              <li>Title</li>
              <li>URL Slug</li>
              <li>Content Type</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form and Preview Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setPreviewMode(false)}
            className={`pb-4 font-medium flex items-center ${!previewMode 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            <Save className="h-4 w-4 mr-2" />
            Edit Content
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`pb-4 font-medium flex items-center ${previewMode 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
        </div>
      </div>

      {previewMode ? (
        renderPreview()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <ContentForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              loading={loading}
              isEdit={false}
              categories={categories}
              tags={tags}
              stations={stations}
              channels={channels}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Publishing
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule For
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor ? new Date(formData.scheduledFor).toISOString().slice(0, 16) : ''}
                      onChange={(e) => handleFormChange('scheduledFor', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {formData.status === 'published' && !formData.publishedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                      onChange={(e) => handleFormChange('publishedAt', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !formData.title || !formData.slug}
                  className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {formData.status === 'draft' ? 'Save Draft' : 
                       formData.status === 'scheduled' ? 'Schedule Content' : 
                       'Publish Content'}
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {formData.status === 'draft' ? 'Save as draft for later editing' :
                   formData.status === 'scheduled' ? 'Schedule for automatic publishing' :
                   'Publish immediately for public viewing'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    const slug = generateSlug(formData.title || '');
                    handleFormChange('slug', slug);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Generate URL Slug from Title
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    now.setHours(now.getHours() + 1);
                    handleFormChange('scheduledFor', now);
                    handleFormChange('status', 'scheduled');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Schedule for 1 hour from now
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    handleFormChange('publishedAt', new Date());
                    handleFormChange('status', 'published');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Publish Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}