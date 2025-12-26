// app/(site)/stations/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Tv, MapPin, Play, Users, Search } from 'lucide-react';

interface Station {
    _id: string;
    name: string;
    type: string;
    region?: string;
    frequency?: string;
    logoUrl?: string;
    description?: string;
    status: string;
}

export default function StationsPage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            // For public access, we'll fetch without auth for now
            // In production, you might want to add public endpoints
            const response = await fetch('/api/stations?status=active');
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

    const filteredStations = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(search.toLowerCase()) ||
                             (station.region && station.region.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === 'all' || station.type === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-16">
                <div className="container-width">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Our Stations
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Discover and tune into our diverse collection of radio and TV stations
                        </p>
                    </div>
                </div>
            </section>

            <div className="container-width py-12">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search stations or regions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="radio">Radio</option>
                        <option value="tv">TV</option>
                    </select>
                </div>

                {/* Stations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStations.map((station) => (
                        <div
                            key={station._id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                        >
                            {/* Station Image/Logo */}
                            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                                {station.logoUrl ? (
                                    <img
                                        src={station.logoUrl}
                                        alt={station.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`p-8 rounded-full ${
                                        station.type === 'radio'
                                            ? 'bg-blue-100 dark:bg-blue-900/30'
                                            : 'bg-purple-100 dark:bg-purple-900/30'
                                    }`}>
                                        {station.type === 'radio' ? (
                                            <Radio className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <Tv className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Station Info */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {station.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                station.type === 'radio'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                            }`}>
                                                {station.type.toUpperCase()}
                                            </span>
                                            {station.frequency && (
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {station.frequency}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {station.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {station.description}
                                    </p>
                                )}

                                {station.region && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <MapPin className="h-4 w-4" />
                                        {station.region}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                                        <Play className="h-4 w-4" />
                                        Listen Live
                                    </button>
                                    <Link
                                        href={`/stations/${station._id}`}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredStations.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-600 mb-4">
                            <Radio className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No stations found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}