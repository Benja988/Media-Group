// components/stations/StationCard.tsx

import Link from 'next/link';
import { Radio, Tv, MapPin, Play, Users } from 'lucide-react';

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

interface StationCardProps {
    station: Station;
    showActions?: boolean;
}

export function StationCard({ station, showActions = true }: StationCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
            {/* Station Image/Logo */}
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center relative">
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

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        station.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                        {station.status}
                    </span>
                </div>
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
                {showActions && (
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
                )}
            </div>
        </div>
    );
}