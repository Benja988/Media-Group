import React from 'react';
import Link from 'next/link';
import { Star, ChevronRight, TrendingUp, Users, Play, CheckCircle } from 'lucide-react';

export function TopStationsCTA({ topStations }: { topStations: any[] }) {
  return (
    <section className="section-py-lg">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Top Stations Section */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 space-y-3 sm:space-y-0">
              <h2 className="flex items-center gap-2">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                Top Stations
              </h2>
              <Link href="/stations" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-small">
                View rankings
                <ChevronRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </Link>
            </div>

            <div className="space-y-2 md:space-y-3">
              {topStations.map((station) => (
                <div
                  key={station.rank}
                  className="card-base p-3 md:p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-lg md:text-xl font-bold text-gray-500 w-6 md:w-8 flex-shrink-0">#{station.rank}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-1">
                        <h4 className="font-semibold truncate text-small">{station.name}</h4>
                        <span className="text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full bg-gray-800 text-gray-300">
                          {station.genre}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
                          {station.listeners.toLocaleString()} listeners
                        </span>
                        <span className={`flex items-center gap-1 ${
                          station.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                          {station.change}
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 md:p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0">
                      <Play className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="card-base relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 card-padding-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-gray-800/50 border border-gray-700 mb-4 md:mb-6">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
                <span className="text-xs md:text-small">No credit card required</span>
              </div>
              
              <h2 className="mb-3 md:mb-4">Ready to Start Broadcasting?</h2>
              
              <p className="text-muted-foreground mb-4 md:mb-6">
                Join thousands of media groups and stations already using RadioWave.
                Start your 14-day free trial today.
              </p>
              
              <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {['Studio-grade audio quality', 'Real-time analytics dashboard', '24/7 customer support'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                    <span className="text-small">{item}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <Link
                  href="/auth/register"
                  className="btn-base btn-size-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold w-full sm:w-auto"
                >
                  Start Free Trial
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopStationsCTA;