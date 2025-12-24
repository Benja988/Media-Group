import React from 'react';
import { Play, Pause, Volume2, Heart, Share2, Download, Music, Users } from 'lucide-react';
import Link from 'next/link';

interface LivePlayerProps {
  featuredStations: any[];
  currentStation: number;
  setCurrentStation: (i: number) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}

export function LivePlayer({ featuredStations, currentStation, setCurrentStation, isPlaying, setIsPlaying, volume, setVolume }: LivePlayerProps) {
  const station = featuredStations[currentStation];

  return (
    <section className="section-py-lg">
      <div className="container-width">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 space-y-3 sm:space-y-0">
          <h2 className="flex items-center gap-2">
            <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-red-500 animate-pulse"></div>
            Live Now
          </h2>
          <Link href="/live" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-small">
            View all stations
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Main Player */}
          <div className="card-base relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-20`} />
            <div className="relative card-padding-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800/50 border border-gray-700 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs">LIVE</span>
                  </div>
                  <h3 className="mb-1">{station.name}</h3>
                  <p className="text-muted-foreground text-small">{station.genre}</p>
                </div>
                <button className="p-2.5 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors self-start sm:self-auto">
                  <Heart className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Music className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="truncate text-small">{station.currentTrack}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-small">{station.listeners.toLocaleString()} listeners</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-2/3"></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2:30</span>
                    <span>3:45</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      {isPlaying ? <Pause className="h-4 w-4 md:h-5 md:w-5" /> : <Play className="h-4 w-4 md:h-5 md:w-5" />}
                    </button>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-20 md:w-24 accent-blue-500"
                      />
                      <span className="text-xs text-muted-foreground w-6 md:w-8">{volume}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button className="p-1.5 md:p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                    <button className="p-1.5 md:p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Station List */}
          <div className="space-y-3 md:space-y-4">
            {featuredStations.map((s, index) => (
              <div
                key={s.id}
                onClick={() => setCurrentStation(index)}
                className={`card-base p-3 md:p-4 transition-all cursor-pointer ${
                  currentStation === index
                    ? 'border-purple-500/50 bg-gray-800/30'
                    : 'hover:border-gray-700 hover:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`h-10 w-10 md:h-12 md:w-12 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                    <svg className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-semibold truncate text-small">{s.name}</h4>
                      {s.live && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.genre}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      {s.listeners.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">listeners</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LivePlayer;