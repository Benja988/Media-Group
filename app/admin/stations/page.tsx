// app/admin/stations/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Radio, Tv, Search, MapPin } from 'lucide-react';

interface Station {
    _id: string;
    name: string;
    type: string;
    status: string;
    region?: string;
    frequency?: string;
    createdAt: string;
    mediaGroupId: { name: string };
}

export default function StationsManagement() {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const response = await fetch('/api/stations');
            if (response.ok) {
                const data = await response.json();
                setStations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this station?')) return;

        try {
            const response = await fetch(`/api/stations?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                setStations(stations.filter(s => s._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete station:', error);
        }
    };

    const filteredStations = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || station.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stations Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage all your radio and TV stations</p>
                </div>
                <Link
                    href="/admin/stations/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Station
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Stations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.map((station) => (
                    <div
                        key={station._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    station.type === 'radio'
                                        ? 'bg-blue-100 dark:bg-blue-900'
                                        : 'bg-purple-100 dark:bg-purple-900'
                                }`}>
                                    {station.type === 'radio' ? (
                                        <Radio className={`h-5 w-5 ${
                                            station.type === 'radio'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-purple-600 dark:text-purple-400'
                                        }`} />
                                    ) : (
                                        <Tv className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {station.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {station.type}
                                    </p>
                                </div>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                station.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : station.status === 'inactive'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                                {station.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            {station.frequency && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Radio className="h-4 w-4" />
                                    {station.frequency}
                                </div>
                            )}
                            {station.region && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin className="h-4 w-4" />
                                    {station.region}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Created {new Date(station.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/stations/${station._id}/edit`}
                                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(station._id)}
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStations.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No stations found.</p>
                </div>
            )}
        </div>
    );
}