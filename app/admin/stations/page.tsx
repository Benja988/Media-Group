// app/admin/stations/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Radio, Tv, Search, MapPin, Eye, BarChart3, Settings } from 'lucide-react';

interface Station {
    _id: string;
    name: string;
    type: string;
    status: string;
    region?: string;
    frequency?: string;
    logoUrl?: string;
    description?: string;
    createdAt: string;
    mediaGroupId: { name: string };
}

export default function StationsManagement() {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        fetchStations();
    }, [filter, typeFilter]);


    const fetchStations = async () => {
        try {
            const params = new URLSearchParams();

            if (filter !== "all") params.set("status", filter);
            if (typeFilter !== "all") params.set("type", typeFilter);
            if (search) params.set("region", search);

            const response = await fetch(`/api/stations?${params.toString()}`);
            const data = await response.json();
            setStations(data);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this station? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/stations?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                setStations(stations.filter(s => s._id !== id));
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete station');
            }
        } catch (error) {
            console.error('Failed to delete station:', error);
            alert('An error occurred while deleting the station');
        }
    };

    const filteredStations = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(search.toLowerCase()) ||
            (station.region && station.region.toLowerCase().includes(search.toLowerCase()));
        const matchesStatusFilter = filter === 'all' || station.status === filter;
        const matchesTypeFilter = typeFilter === 'all' || station.type === typeFilter;
        return matchesSearch && matchesStatusFilter && matchesTypeFilter;
    });

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stations Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your radio and TV stations</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <Link
                        href="/admin/stations/analytics"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                    </Link>
                    <Link
                        href="/admin/stations/new"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Station
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stations</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stations.length}</p>
                        </div>
                        <Radio className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Stations</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stations.filter(s => s.status === 'active').length}
                            </p>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Radio Stations</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stations.filter(s => s.type === 'radio').length}
                            </p>
                        </div>
                        <Radio className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TV Stations</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stations.filter(s => s.type === 'tv').length}
                            </p>
                        </div>
                        <Tv className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search stations by name or region..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="radio">Radio</option>
                        <option value="tv">TV</option>
                    </select>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Stations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.map((station) => (
                    <div
                        key={station._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        {/* Station Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${station.type === 'radio'
                                        ? 'bg-blue-100 dark:bg-blue-900'
                                        : 'bg-purple-100 dark:bg-purple-900'
                                        }`}>
                                        {station.type === 'radio' ? (
                                            <Radio className={`h-6 w-6 ${station.type === 'radio'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-purple-600 dark:text-purple-400'
                                                }`} />
                                        ) : (
                                            <Tv className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                            {station.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                            {station.type} Station
                                        </p>
                                    </div>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${station.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : station.status === 'inactive'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                    }`}>
                                    {station.status}
                                </span>
                            </div>

                            {/* Station Details */}
                            <div className="space-y-3">
                                {station.frequency && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Radio className="h-4 w-4" />
                                        <span>Frequency: {station.frequency}</span>
                                    </div>
                                )}
                                {station.region && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <MapPin className="h-4 w-4" />
                                        <span>{station.region}</span>
                                    </div>
                                )}
                                {station.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {station.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Created {new Date(station.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/stations/${station._id}`}
                                        className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        title="View Public Page"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`/admin/stations/${station._id}/edit`}
                                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                        title="Edit Station"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`/admin/stations/${station._id}/settings`}
                                        className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        title="Station Settings"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(station._id)}
                                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        title="Delete Station"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStations.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-400 dark:text-gray-600 mb-4">
                        <Radio className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        No stations found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {search || filter !== 'all' || typeFilter !== 'all'
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Get started by creating your first station.'}
                    </p>
                    {!search && filter === 'all' && typeFilter === 'all' && (
                        <Link
                            href="/admin/stations/new"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Station
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}