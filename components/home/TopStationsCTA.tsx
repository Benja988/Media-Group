import React from 'react';
import Link from 'next/link';
import { Star, ChevronRight, TrendingUp, Users, Play, CheckCircle } from 'lucide-react';

export function TopStationsCTA({ topStations }: { topStations: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Top Stations
          </h2>
          <Link href="/stations" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
            View rankings
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {topStations.map((station) => (
            <div
              key={station.rank}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-500 w-8">#{station.rank}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{station.name}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">{station.genre}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {station.listeners.toLocaleString()} listeners
                  </span>
                  <span className={`flex items-center gap-1 ${station.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="h-3 w-3" />
                    {station.change}
                  </span>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Play className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 p-8 border border-gray-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm">No credit card required</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to Start Broadcasting?</h2>
          <p className="text-gray-400 mb-6">
            Join thousands of media groups and stations already using RadioWave.
            Start your 14-day free trial today.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Studio-grade audio quality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Real-time analytics dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>24/7 customer support</span>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-semibold w-full sm:w-auto"
            >
              Start Free Trial
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TopStationsCTA;
