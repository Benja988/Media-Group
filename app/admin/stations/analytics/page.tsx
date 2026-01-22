"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Radio,
  Tv,
  BarChart3,
  Activity,
  Archive,
} from "lucide-react";

interface Station {
  _id: string;
  type: "radio" | "tv";
  status: "active" | "inactive" | "archived";
  region?: string;
  createdAt: string;
}

export default function StationsAnalyticsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stations")
      .then(res => res.json())
      .then(data => setStations(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading analytics…</div>;
  }

  const total = stations.length;
  const active = stations.filter(s => s.status === "active").length;
  const inactive = stations.filter(s => s.status === "inactive").length;
  const archived = stations.filter(s => s.status === "archived").length;
  const radios = stations.filter(s => s.type === "radio").length;
  const tvs = stations.filter(s => s.type === "tv").length;

  const byRegion = stations.reduce<Record<string, number>>((acc, s) => {
    if (!s.region) return acc;
    acc[s.region] = (acc[s.region] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/stations"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stations
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Stations Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your broadcast network
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard label="Total Stations" value={total} icon={BarChart3} />
        <StatCard label="Active" value={active} icon={Activity} />
        <StatCard label="Inactive" value={inactive} icon={Radio} />
        <StatCard label="Archived" value={archived} icon={Archive} />
        <StatCard label="TV Stations" value={tvs} icon={Tv} />
      </div>

      {/* Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="font-semibold text-lg mb-4">By Type</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Radio Stations</span>
              <span className="font-medium">{radios}</span>
            </li>
            <li className="flex justify-between">
              <span>TV Stations</span>
              <span className="font-medium">{tvs}</span>
            </li>
          </ul>
        </div>

        {/* Region Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="font-semibold text-lg mb-4">By Region</h3>

          {Object.keys(byRegion).length === 0 ? (
            <p className="text-sm text-gray-500">No region data available</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(byRegion).map(([region, count]) => (
                <li key={region} className="flex justify-between text-sm">
                  <span>{region}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="font-semibold text-lg mb-4">Growth Timeline</h3>
        <p className="text-sm text-gray-500">
          Stations created over time (simple count)
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          {stations
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
            .map(station => (
              <li
                key={station._id}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {station.type.toUpperCase()} • {station.status}
                </span>
                <span>
                  {new Date(station.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small reusable stat card                                                   */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-500" />
    </div>
  );
}
