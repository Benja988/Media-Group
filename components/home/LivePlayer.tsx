import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Heart, Share2, Download, Music, Users, Radio, Zap, Sparkles, SkipBack, SkipForward, Maximize2, Headphones, Signal, Award, Clock, ChevronRight, Globe, Wifi, Shield, AlertCircle, TrendingUp, Podcast, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Station {
  id: number;
  name: string;
  genre: string;
  color: string;
  lightColor: string;
  darkColor: string;
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
  const [currentTime, setCurrentTime] = useState(0);
  
  // Check if we have any stations
  const hasStations = featuredStations && featuredStations.length > 0;
  
  // Demo station for when no stations are available
  const demoStation: Station = {
    id: 0,
    name: 'Tetemeko Media Radio',
    genre: 'News & Talk',
    color: 'from-blue-600 to-blue-500',
    lightColor: 'from-blue-600 to-blue-500',
    darkColor: 'from-blue-500 to-blue-400',
    currentTrack: 'Coming Soon - Stay Tuned!',
    listeners: 0,
    bitrate: '320kbps',
    frequency: 'FM 102.5',
    live: false
  };

  const station = hasStations ? featuredStations[currentStation] : demoStation;

  // Simulate progress animation only when playing and stations available
  useEffect(() => {
    if (isPlaying && hasStations) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 225) return 0;
          return prev + 1;
        });
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 0.44;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // Reset progress when not playing
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isPlaying, hasStations]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Demo station data for empty state
  const demoStations: Station[] = [
    {
      id: 1,
      name: 'Tetemeko News Radio',
      genre: 'News & Current Affairs',
      color: 'from-blue-600 to-blue-500',
      lightColor: 'from-blue-600 to-blue-500',
      darkColor: 'from-blue-500 to-blue-400',
      currentTrack: 'Morning Briefing',
      listeners: 0,
      bitrate: '256kbps',
      frequency: 'Coming Soon',
      live: false
    },
  ];

  const displayStations = hasStations ? featuredStations : demoStations;

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-[#0a1521] dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-100/20 dark:from-blue-900/5 dark:via-transparent dark:to-blue-900/10" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl animate-float" />
        
        {/* Signal Waves */}
        <div className="absolute inset-0 overflow-hidden">
          {[1, 2, 3].map((wave) => (
            <div
              key={wave}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20 dark:border-blue-400/10"
              style={{
                width: `${wave * 40}vw`,
                height: `${wave * 40}vw`,
                animation: `wave ${6 + wave * 3}s linear infinite`,
                animationDelay: `${wave * 0.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Signal Dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/5"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container-width relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 lg:mb-16">
          <div className="mb-6 lg:mb-0 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-gray-900/80 dark:to-gray-950/80 border-blue-500/30 dark:border-blue-400/20 mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur bg-blue-600/30 dark:bg-blue-500/30" />
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur animate-ping bg-blue-600/50 dark:bg-blue-500/50" />
                    <div className="relative h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  </div>
                  <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                    {hasStations ? 'Live Broadcasting 24/7' : 'Broadcast Platform Preview'}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">Tune Into</span>{' '}
              <span className="relative inline-block">
                <span className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
                  {hasStations ? 'Live Radio' : 'Coming Soon'}
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 rounded-full transform scale-x-0 animate-grow bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300" />
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
              {hasStations 
                ? 'Stream premium radio stations with crystal-clear audio quality and real-time analytics. Professional broadcasting at your fingertips.'
                : 'Our professional broadcast platform is launching soon. Preview our upcoming stations and experience studio-grade audio quality.'
              }
            </p>
          </div>
          
          {hasStations && (
            <Link
              href="/live"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-xl backdrop-blur-xl border font-medium transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-gray-900/70 dark:to-gray-950/70 border-blue-500/30 dark:border-blue-400/20 hover:border-blue-500/50 dark:hover:border-blue-500/30 text-blue-900 dark:text-blue-100"
            >
              <span>View All Stations</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Coming Soon Notice for empty state */}
        {!hasStations && (
          <div className="mb-8">
            <div className="p-6 rounded-2xl backdrop-blur-xl border bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-gray-900/80 dark:to-gray-950/80 border-blue-500/30 dark:border-blue-400/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Broadcast Platform Under Development
                  </h3>
                  <p className="text-blue-700/80 dark:text-blue-300/80 mb-4">
                    Our professional broadcast stations are currently being set up. Preview our upcoming channels below. 
                    Launch scheduled for early next month.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-gray-800 text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Launching Soon
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-gray-800 text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      Professional Grade
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-gray-800 text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <Podcast className="h-3 w-3" />
                      Multi-Platform
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Player - Professional Design */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden group backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-gray-950" />
              <div className={`absolute inset-0 bg-gradient-to-br ${station.lightColor} dark:${station.darkColor} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500`} />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="relative p-6 md:p-8">
                {/* Station Header */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className={`relative ${!hasStations ? 'opacity-70' : ''}`}>
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur opacity-20 animate-pulse" />
                      <div className={`relative px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold flex items-center gap-2 ${!hasStations && 'bg-gradient-to-r from-blue-400 to-blue-300'}`}>
                        <div className={`h-2 w-2 rounded-full bg-white animate-pulse ${!hasStations && 'animate-none'}`} />
                        {hasStations ? 'BROADCAST' : 'DEMO PREVIEW'}
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        {station.bitrate}
                      </span>
                    </div>
                    <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2">
                        <Headphones className="h-3 w-3" />
                        {hasStations ? `${station.listeners.toLocaleString()} listeners` : '0 listeners (Preview)'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {station.name}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        {station.genre} • {station.frequency}
                      </p>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-center p-3 rounded-xl backdrop-blur-sm bg-blue-50/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700">
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">99.9%</div>
                        <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Uptime</div>
                      </div>
                      <div className="text-center p-3 rounded-xl backdrop-blur-sm bg-blue-50/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700">
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">HD</div>
                        <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Quality</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Track */}
                <div className="mb-8 p-5 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200/50 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30">
                      <Music className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-blue-700/80 dark:text-blue-300/80 mb-1 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {hasStations ? 'Now Playing' : 'Sample Track'}
                      </div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                        {station.currentTrack}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                          isFavorite 
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
                            : 'bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-gray-700 text-blue-900 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 text-blue-900 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-blue-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-blue-700/80 dark:text-blue-300/80">
                      <span>{formatTime(currentTime)}</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button 
                        className="p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 text-blue-900 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300"
                        disabled={!hasStations}
                      >
                        <SkipBack className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => hasStations && setIsPlaying(isPlaying)} // USE !isPlaying) TO PLAY
                        className="relative group/play"
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 rounded-full blur opacity-0 group-hover/play:opacity-30 transition-opacity duration-300" />
                        <div className={`relative h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-500 transition-all duration-300 hover:scale-105 shadow-xl ${!hasStations && 'opacity-70 cursor-not-allowed'}`}>
                          {hasStations ? (
                            isPlaying ? (
                              <Pause className="h-7 w-7 text-white" />
                            ) : (
                              <Play className="h-7 w-7 text-white ml-1" />
                            )
                          ) : (
                            <Play className="h-7 w-7 text-white ml-1 opacity-50" />
                          )}
                        </div>
                      </button>
                      
                      <button 
                        className="p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 text-blue-900 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300"
                        disabled={!hasStations}
                      >
                        <SkipForward className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Volume Control */}
                      <div className="flex items-center gap-3">
                        <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div className="relative group">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-32 accent-gradient-blue"
                            disabled={!hasStations}
                          />
                          <div className="absolute -bottom-7 left-0 px-2 py-1 rounded text-xs bg-gray-900 dark:bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700">
                            Volume: {volume}%
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 text-blue-900 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300"
                          disabled={!hasStations}
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-3 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 text-blue-900 dark:text-blue-300 hover:border-blue-500 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300"
                          disabled={!hasStations}
                        >
                          <Maximize2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="mt-8 pt-6 border-t border-blue-200/50 dark:border-gray-800">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm text-blue-700/80 dark:text-blue-300/80">
                            {hasStations ? 'Live Listeners' : 'Upcoming Station'}
                          </div>
                          <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                            {hasStations ? station.listeners.toLocaleString() : 'Launching Soon'}
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-blue-200/50 dark:bg-gray-700" />
                      <div>
                        <div className="text-sm text-blue-700/80 dark:text-blue-300/80">Peak Today</div>
                        <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                          {hasStations ? (station.listeners * 1.2).toLocaleString() : 'Coming Soon'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Signal className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {hasStations ? 'Excellent' : 'Ready Soon'}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-blue-200/50 dark:bg-gray-700" />
                      <div className="text-sm text-blue-700/80 dark:text-blue-300/80">
                        <span className="flex items-center gap-1">
                          <Wifi className="h-4 w-4" />
                          {hasStations ? 'Latency: 45ms' : 'Quality: HD'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Station List - Sidebar */}
          <div className="space-y-6">
            {/* Header */}
            <div className="p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-gray-900/70 dark:to-gray-950/70 border border-blue-200/50 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {hasStations ? 'Featured Stations' : 'Upcoming Stations'}
                  </h3>
                  <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                    {hasStations ? 'Professional broadcast channels' : 'Preview our launch lineup'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-gray-800 text-sm font-medium text-blue-900 dark:text-blue-100">
                  {displayStations.length} total
                </span>
              </div>
            </div>

            {/* Station List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {displayStations.map((s, index) => (
                <div
                  key={s.id}
                  onClick={() => hasStations && setCurrentStation(index)}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    (hasStations && currentStation === index)
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border-2 border-blue-500/50 dark:border-blue-500/30 shadow-lg'
                      : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-blue-200/30 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-500/30'
                  } ${!hasStations && 'opacity-80'}`}
                >
                  {/* Coming Soon Overlay for demo stations */}
                  {!hasStations && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent" />
                  )}

                  {/* Selection Indicator */}
                  {(hasStations && currentStation === index) && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 rounded-full" />
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    {/* Station Icon */}
                    <div className={`relative flex-shrink-0 ${(hasStations && currentStation === index) ? 'scale-110' : ''} transition-transform duration-300`}>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.lightColor} dark:${s.darkColor} flex items-center justify-center shadow-lg ${!hasStations && 'opacity-80'}`}>
                        <Radio className="h-6 w-6 text-white" />
                      </div>
                      {s.live && (
                        <div className="absolute -top-1 -right-1">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full blur animate-ping" />
                            <div className="relative h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Station Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 truncate">
                          {s.name}
                        </h4>
                        {s.live && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-blue-700/80 dark:text-blue-300/80 truncate mb-2">
                        {s.genre}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-blue-600/80 dark:text-blue-400/80 px-2 py-1 rounded-full bg-blue-50/50 dark:bg-gray-800/50">
                          <Users className="h-3 w-3" />
                          {hasStations ? s.listeners.toLocaleString() : 'Coming Soon'}
                        </span>
                        <span className="text-blue-600/80 dark:text-blue-400/80 px-2 py-1 rounded-full bg-blue-50/50 dark:bg-gray-800/50">
                          {s.bitrate}
                        </span>
                      </div>
                    </div>

                    {/* Play Indicator */}
                    <div className="flex-shrink-0">
                      {(hasStations && currentStation === index) ? (
                        <div className="p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400">
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
                        <div className="p-2.5 rounded-lg bg-blue-100/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="h-3 w-3 text-blue-900 dark:text-blue-100" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spectrum Visualization */}
            <div className="p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-gray-900/70 dark:to-gray-950/70 border border-blue-200/50 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {hasStations ? 'Frequency Spectrum' : 'Preview Visualization'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
                    {hasStations ? 'Real-time audio visualization' : 'Sample audio spectrum display'}
                  </p>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-900 dark:text-blue-100">
                  {hasStations ? 'LIVE' : 'PREVIEW'}
                </div>
              </div>
              <div className="h-16 flex items-end justify-center gap-1">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-t bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 dark:from-blue-500 dark:via-blue-400 dark:to-blue-300"
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      animation: `spectrum ${0.5 + Math.random()}s ease-in-out infinite ${i * 0.02}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes wave {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        @keyframes spectrum {
          0%, 100% { height: 10px; }
          50% { height: 40px; }
        }
        @keyframes grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-grow { animation: grow 1s ease-out forwards; animation-delay: 0.5s; }
        
        input.accent-gradient-blue {
          background: linear-gradient(to right, #3b82f6, #2563eb);
          height: 6px;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }
        
        input.accent-gradient-blue:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        input.accent-gradient-blue::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
          transition: all 0.2s;
        }
        
        input.accent-gradient-blue::-webkit-slider-thumb:hover {
          border-color: #2563eb;
          box-shadow: 0 2px 15px rgba(59, 130, 246, 0.5);
        }
        
        input.accent-gradient-blue::-webkit-slider-thumb:disabled {
          border-color: #93c5fd;
          cursor: not-allowed;
        }
        
        input.accent-gradient-blue::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
          transition: all 0.2s;
        }
        
        input.accent-gradient-blue::-moz-range-thumb:hover {
          border-color: #2563eb;
          box-shadow: 0 2px 15px rgba(59, 130, 246, 0.5);
        }
        
        input.accent-gradient-blue::-moz-range-thumb:disabled {
          border-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}