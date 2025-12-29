// components/stations/StationGrid.tsx

import { StationCard } from './StationCard';

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

interface StationGridProps {
    stations: Station[];
    loading: boolean;
}

export function StationGrid({ stations, loading }: StationGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
                        <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
                        <div className="p-6 space-y-3">
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                            <div className="flex gap-3 pt-2">
                                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
                                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (stations.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    No stations found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    We couldn't find any stations matching your criteria. Try adjusting your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
                <StationCard key={station._id} station={station} />
            ))}
        </div>
    );
}