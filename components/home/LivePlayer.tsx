import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Heart, Share2, Download, Music, Users, Radio, Zap, Sparkles, SkipBack, SkipForward, Maximize2 } from 'lucide-react';
import Link from 'next/link';

interface Station {
  id: number;
  name: string;
  genre: string;
  color: string;
  currentTrack: string;
  listeners: number;
  bitrate: string;
  frequency?: string;
  live: boolean;
}

interface LivePlayerProps {
  featuredStations: Station[];
  currentStation: number;
  setCurrentStation: (i: number) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}

export function LivePlayer({ featuredStations, currentStation, setCurrentStation, isPlaying, setIsPlaying, volume, setVolume }: LivePlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const station = featuredStations[currentStation];

  // Simulate progress animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-width relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 dark:border-red-500/30 backdrop-blur-sm mb-4">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Live Broadcasting
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-gray-900 dark:text-white">Tune Into</span>{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                Live Radio
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
              Stream premium radio stations with crystal-clear audio and real-time analytics
            </p>
          </div>
          <Link
            href="/live"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
          >
            <span>View All Stations</span>
            <div className="group-hover:translate-x-1 transition-transform">
              →
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Player - Glass Morphism Design */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden group">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" />
              <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="relative p-6 md:p-8 backdrop-blur-sm">
                {/* Station Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-20 animate-pulse" />
                        <div className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          LIVE BROADCAST
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Zap className="h-3 w-3" />
                          {station.bitrate}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {station.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {station.genre} • {station.frequency || 'Online Streaming'}
                    </p>
                    
                    {/* Current Track */}
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                          <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Now Playing</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {station.currentTrack}
                          </div>
                        </div>
                        <button
                          onClick={() => setIsFavorite(!isFavorite)}
                          className={`p-2 rounded-lg transition-all duration-300 ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>2:30</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-105">
                        <SkipBack className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </button>
                      
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="relative group/play"
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-0 group-hover/play:opacity-30 transition-opacity duration-300" />
                        <div className="relative h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg">
                          {isPlaying ? (
                            <Pause className="h-6 w-6 text-white" />
                          ) : (
                            <Play className="h-6 w-6 text-white ml-0.5" />
                          )}
                        </div>
                      </button>
                      
                      <button className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-105">
                        <SkipForward className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Volume Control */}
                      <div className="flex items-center gap-3">
                        <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <div className="relative group">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 accent-gradient"
                          />
                          <div className="absolute -bottom-6 left-0 px-2 py-1 rounded text-xs bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {volume}%
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-105">
                          <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-105">
                          <Download className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-105">
                          <Maximize2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Live Listeners</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {station.listeners.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Peak Today</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {(station.listeners * 1.2).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Stream Quality</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        Excellent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Station List - Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Featured Stations
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {featuredStations.length} total
              </span>
            </div>

            <div className="space-y-3">
              {featuredStations.map((s, index) => (
                <div
                  key={s.id}
                  onClick={() => setCurrentStation(index)}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    currentStation === index
                      ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/50 dark:border-purple-500/30'
                      : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  {/* Selection Indicator */}
                  {currentStation === index && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                  )}

                  <div className="flex items-center gap-4">
                    {/* Station Icon */}
                    <div className={`relative flex-shrink-0 ${currentStation === index ? 'scale-110' : ''} transition-transform duration-300`}>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                        <Radio className="h-6 w-6 text-white" />
                      </div>
                      {s.live && (
                        <div className="absolute -top-1 -right-1">
                          <div className="relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur animate-ping" />
                            <div className="relative h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Station Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {s.name}
                        </h4>
                        {s.live && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                        {s.genre}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Users className="h-3 w-3" />
                          {s.listeners.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{s.bitrate}</span>
                      </div>
                    </div>

                    {/* Play Indicator */}
                    <div className="flex-shrink-0">
                      {currentStation === index ? (
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                          {isPlaying ? (
                            <div className="flex items-center gap-0.5">
                              <div className="h-2 w-0.5 bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
                              <div className="h-2 w-0.5 bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
                              <div className="h-2 w-0.5 bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                          ) : (
                            <Play className="h-3 w-3 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-3 w-3 text-gray-700 dark:text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Frequency Spectrum Visualization */}
            <div className="mt-6 p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Frequency Spectrum</span>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <div className="h-20 flex items-end justify-center gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-t bg-gradient-to-t from-purple-500 via-blue-500 to-cyan-500"
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      animation: `spectrum ${1 + Math.random()}s ease-in-out infinite ${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for gradient input */}
      <style jsx global>{`
        @keyframes spectrum {
          0%, 100% { height: 10px; }
          50% { height: 40px; }
        }
        
        input.accent-gradient {
          background: linear-gradient(to right, #8b5cf6, #3b82f6);
          height: 4px;
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
        }
        
        input.accent-gradient::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
        }
        
        input.accent-gradient::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </section>
  );
}