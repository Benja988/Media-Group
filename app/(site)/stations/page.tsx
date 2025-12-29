// app/(site)/stations/page.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
import { StationHero } from '@/components/stations/StationHero';
import { StationFilters } from '@/components/stations/StationFilters';
import { StationGrid } from '@/components/stations/StationGrid';

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
    const [selectedRegion, setSelectedRegion] = useState('');

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
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

    // Get unique regions for filter
    const regions = useMemo(() => {
        const uniqueRegions = new Set(stations.map(s => s.region).filter(Boolean));
        return Array.from(uniqueRegions).sort();
    }, [stations]);

    // Filter stations based on search and filters
    const filteredStations = useMemo(() => {
        return stations.filter(station => {
            const matchesSearch = station.name.toLowerCase().includes(search.toLowerCase()) ||
                                 (station.region && station.region.toLowerCase().includes(search.toLowerCase()));
            const matchesFilter = filter === 'all' || station.type === filter;
            const matchesRegion = !selectedRegion || station.region === selectedRegion;
            return matchesSearch && matchesFilter && matchesRegion;
        });
    }, [stations, search, filter, selectedRegion]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StationHero />

            <div className="container-width py-12">
                <StationFilters
                    search={search}
                    onSearchChange={setSearch}
                    filter={filter}
                    onFilterChange={setFilter}
                    regions={regions}
                    selectedRegion={selectedRegion}
                    onRegionChange={setSelectedRegion}
                    totalStations={filteredStations.length}
                />

                <StationGrid stations={filteredStations} loading={loading} />
            </div>
        </div>
    );
}