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
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
          Live Now
        </h2>
        <Link href="/live" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
          View all stations
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 group">
          <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-20`} />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mb-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-sm">LIVE</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{station.name}</h3>
                <p className="text-gray-400">{station.genre}</p>
              </div>
              <button className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Music className="h-4 w-4" />
                <span className="truncate">{station.currentTrack}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="h-4 w-4" />
                <span>{station.listeners.toLocaleString()} listeners</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-2/3"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>2:30</span>
                  <span>3:45</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-24 accent-blue-500"
                    />
                    <span className="text-sm text-gray-400 w-8">{volume}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {featuredStations.map((s, index) => (
            <div
              key={s.id}
              onClick={() => setCurrentStation(index)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                currentStation === index
                  ? 'border-purple-500/50 bg-gray-800/30'
                  : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <svg className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{s.name}</h4>
                    {s.live && (
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{s.genre}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Users className="h-3 w-3" />
                    {s.listeners.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">listeners</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LivePlayer;
