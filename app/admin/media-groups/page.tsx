'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Types
interface MediaGroup {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  status: 'active' | 'inactive' | 'archived';
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    websiteUrl?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateMediaGroupData {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  status?: 'active' | 'inactive' | 'archived';
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    websiteUrl?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

interface EditMediaGroupData extends Omit<CreateMediaGroupData, 'slug'> {
  id: string;
}

// API Helper Functions
const api = {
  async fetchMediaGroups(params?: {
    status?: 'active' | 'inactive' | 'archived';
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'name' | 'status';
    sortOrder?: 1 | -1;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder.toString());
    
    const response = await fetch(`/api/media-groups?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch media groups');
    }
    
    return response.json();
  },

  async createMediaGroup(data: CreateMediaGroupData) {
    const response = await fetch('/api/media-groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create media group');
    }

    return response.json();
  },

  async updateMediaGroup(data: EditMediaGroupData) {
    const response = await fetch('/api/media-groups', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update media group');
    }

    return response.json();
  },

  async deleteMediaGroup(id: string) {
    const response = await fetch(`/api/media-groups?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete media group');
    }
  },

  async archiveMediaGroup(id: string) {
    const response = await fetch(`/api/media-groups/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to archive media group');
    }

    return response.json();
  },

  async restoreMediaGroup(id: string) {
    const response = await fetch(`/api/media-groups/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to restore media group');
    }

    return response.json();
  },
};

// Main Component
export default function MediaGroupsAdminPage() {
  // State
  const [mediaGroups, setMediaGroups] = useState<MediaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Filtering & Pagination
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMediaGroup, setSelectedMediaGroup] = useState<MediaGroup | null>(null);
  
  // Form Data
  const [createFormData, setCreateFormData] = useState<CreateMediaGroupData>({
    name: '',
    slug: '',
    description: '',
    status: 'active',
  });
  
  const [editFormData, setEditFormData] = useState<EditMediaGroupData>({
    id: '',
    name: '',
    description: '',
    status: 'active',
  });

  // Fetch media groups
  const fetchMediaGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        sortBy,
        sortOrder,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await api.fetchMediaGroups(params);
      setMediaGroups(response);
      // If the API doesn't return total count, we'll estimate based on if we got full page
      setTotalCount(response.length === rowsPerPage ? page * rowsPerPage + 1 : page * rowsPerPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media groups');
      setSnackbar({
        open: true,
        message: 'Failed to load media groups',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, rowsPerPage, sortBy, sortOrder]);

  // Initial load
  useEffect(() => {
    fetchMediaGroups();
  }, [fetchMediaGroups]);

  // Handlers
  const handleCreateSubmit = async () => {
    try {
      await api.createMediaGroup(createFormData);
      setCreateDialogOpen(false);
      setCreateFormData({
        name: '',
        slug: '',
        description: '',
        status: 'active',
      });
      fetchMediaGroups();
      setSnackbar({
        open: true,
        message: 'Media group created successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to create media group',
        severity: 'error',
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedMediaGroup) return;
    
    try {
      await api.updateMediaGroup(editFormData);
      setEditDialogOpen(false);
      fetchMediaGroups();
      setSnackbar({
        open: true,
        message: 'Media group updated successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to update media group',
        severity: 'error',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMediaGroup) return;
    
    try {
      await api.deleteMediaGroup(selectedMediaGroup._id);
      setDeleteDialogOpen(false);
      fetchMediaGroups();
      setSnackbar({
        open: true,
        message: 'Media group deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to delete media group',
        severity: 'error',
      });
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.archiveMediaGroup(id);
      fetchMediaGroups();
      setSnackbar({
        open: true,
        message: 'Media group archived',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to archive media group',
        severity: 'error',
      });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.restoreMediaGroup(id);
      fetchMediaGroups();
      setSnackbar({
        open: true,
        message: 'Media group restored',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to restore media group',
        severity: 'error',
      });
    }
  };

  const handleSort = (field: 'createdAt' | 'name' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 1 ? -1 : 1);
    } else {
      setSortBy(field);
      setSortOrder(-1);
    }
  };

  // Status Chip Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Groups</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setCreateDialogOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Add Media Group
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search media groups..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <div className="flex gap-2">
              <button
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2"
                onClick={fetchMediaGroups}
                disabled={loading}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2"
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                  setPage(1);
                }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Groups Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {sortBy === 'name' && (
                      <span className="text-xs">
                        {sortOrder === 1 ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {sortBy === 'status' && (
                      <span className="text-xs">
                        {sortOrder === 1 ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {sortBy === 'createdAt' && (
                      <span className="text-xs">
                        {sortOrder === 1 ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  </td>
                </tr>
              ) : mediaGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No media groups found
                  </td>
                </tr>
              ) : (
                mediaGroups.map((group) => (
                  <tr key={group._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {group.logoUrl && (
                          <img
                            src={group.logoUrl}
                            alt={group.name}
                            className="h-10 w-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {group.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{group.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                        {group.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(group.status)}`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(group.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                          onClick={() => {
                            setSelectedMediaGroup(group);
                            setEditFormData({
                              id: group._id,
                              name: group.name,
                              description: group.description || '',
                              status: group.status,
                              logoUrl: group.logoUrl,
                              branding: group.branding,
                              contactInfo: group.contactInfo,
                            });
                            setEditDialogOpen(true);
                          }}
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {group.status === 'archived' ? (
                          <button
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Restore"
                            onClick={() => handleRestore(group._id)}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Archive"
                            onClick={() => handleArchive(group._id)}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                          onClick={() => {
                            setSelectedMediaGroup(group);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {mediaGroups.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-center">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  First
                </button>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {page} of {Math.ceil(totalCount / rowsPerPage)}
                </span>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(totalCount / rowsPerPage)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(Math.ceil(totalCount / rowsPerPage))}
                  disabled={page >= Math.ceil(totalCount / rowsPerPage)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Last
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Create Media Group</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createFormData.name}
                    onChange={(e) => {
                      setCreateFormData({
                        ...createFormData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createFormData.slug}
                    onChange={(e) => setCreateFormData({
                      ...createFormData,
                      slug: e.target.value,
                    })}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">URL-friendly identifier</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createFormData.logoUrl || ''}
                    onChange={(e) => setCreateFormData({
                      ...createFormData,
                      logoUrl: e.target.value,
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createFormData.status}
                    onChange={(e) => setCreateFormData({
                      ...createFormData,
                      status: e.target.value as 'active' | 'inactive' | 'archived',
                    })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleCreateSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Edit Media Group</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      name: e.target.value,
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editFormData.logoUrl || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      logoUrl: e.target.value,
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      status: e.target.value as 'active' | 'inactive' | 'archived',
                    })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleEditSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete "{selectedMediaGroup?.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`${
            snackbar.severity === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } border rounded-lg shadow-lg px-6 py-4 flex items-center justify-between min-w-[300px]`}>
            <span>{snackbar.message}</span>
            <button
              onClick={closeSnackbar}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}