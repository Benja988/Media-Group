// components/stations/StationFilters.tsx

import { Search, Filter, Radio, Tv, MapPin, X } from 'lucide-react';

interface StationFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    filter: string;
    onFilterChange: (value: string) => void;
    regions: string[];
    selectedRegion: string;
    onRegionChange: (value: string) => void;
    totalStations: number;
}

export function StationFilters({
    search,
    onSearchChange,
    filter,
    onFilterChange,
    regions,
    selectedRegion,
    onRegionChange,
    totalStations
}: StationFiltersProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Stations</h2>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {totalStations} stations available
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search stations by name or region..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Station Type
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onFilterChange('all')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                filter === 'all'
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400'
                            }`}
                        >
                            <Radio className="h-4 w-4" />
                            All
                        </button>
                        <button
                            onClick={() => onFilterChange('radio')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                filter === 'radio'
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}
                        >
                            <Radio className="h-4 w-4" />
                            Radio
                        </button>
                        <button
                            onClick={() => onFilterChange('tv')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                filter === 'tv'
                                    ? 'bg-pink-600 text-white border-pink-600'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-pink-400'
                            }`}
                        >
                            <Tv className="h-4 w-4" />
                            TV
                        </button>
                    </div>
                </div>

                {/* Region Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Region
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedRegion}
                            onChange={(e) => onRegionChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        >
                            <option value="">All Regions</option>
                            {regions.map((region) => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {(search || filter !== 'all' || selectedRegion) && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                        {search && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                                Search: {search}
                                <button onClick={() => onSearchChange('')} className="ml-1">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {filter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                Type: {filter}
                                <button onClick={() => onFilterChange('all')} className="ml-1">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {selectedRegion && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                Region: {selectedRegion}
                                <button onClick={() => onRegionChange('')} className="ml-1">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}