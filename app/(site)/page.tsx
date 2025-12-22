'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Share2, 
  Download, 
  Clock, 
  Users,
  TrendingUp,
  Radio,
  Mic2,
  Music,
  Globe,
  Shield,
  BarChart3,
  Zap,
  ChevronRight,
  Star,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [volume, setVolume] = useState(80);

  const featuredStations = [
    {
      id: 1,
      name: 'Pure Lounge',
      genre: 'Chillout • Lo-fi • Ambient',
      listeners: 2450,
      currentTrack: 'Midnight City - M83',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800',
      color: 'from-purple-600 to-pink-600',
      live: true
    },
    {
      id: 2,
      name: 'Energy FM',
      genre: 'EDM • House • Dance',
      listeners: 3200,
      currentTrack: 'Don\'t You Worry Child - Swedish House Mafia',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800',
      color: 'from-orange-600 to-red-600',
      live: true
    },
    {
      id: 3,
      name: 'Classical Waves',
      genre: 'Classical • Orchestral',
      listeners: 890,
      currentTrack: 'Moonlight Sonata - Beethoven',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800',
      color: 'from-blue-600 to-cyan-600',
      live: false
    },
    {
      id: 4,
      name: 'Urban Beats',
      genre: 'Hip Hop • R&B',
      listeners: 4100,
      currentTrack: 'SICKO MODE - Travis Scott',
      image: 'https://images.unsplash.com/photo-1519281682544-5f37c4d2f7b5?auto=format&fit=crop&w=800',
      color: 'from-green-600 to-emerald-600',
      live: true
    },
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: 'Active Users', value: '10,458', change: '+12%' },
    { icon: <Radio className="h-6 w-6" />, label: 'Stations', value: '256', change: '+5' },
    { icon: <Globe className="h-6 w-6" />, label: 'Countries', value: '42', change: '+3' },
    { icon: <TrendingUp className="h-6 w-6" />, label: 'Stream Hours', value: '1.2M', change: '+24%' },
  ];

  const features = [
    {
      icon: <Mic2 className="h-8 w-8" />,
      title: 'Professional Broadcasting',
      description: 'Studio-grade audio quality with multi-format support',
      color: 'text-purple-400'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Reliable',
      description: '99.9% uptime with enterprise-grade security',
      color: 'text-blue-400'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description: 'Real-time listener insights and performance metrics',
      color: 'text-green-400'
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: 'Media Management',
      description: 'Smart playlist automation and content scheduling',
      color: 'text-pink-400'
    },
  ];

  const topStations = [
    { rank: 1, name: 'Hit Factory', listeners: 5400, genre: 'Pop', change: '+15%' },
    { rank: 2, name: 'Rock Nation', listeners: 4800, genre: 'Rock', change: '+8%' },
    { rank: 3, name: 'Jazz Lounge', listeners: 3200, genre: 'Jazz', change: '+12%' },
    { rank: 4, name: 'EDM Universe', listeners: 6100, genre: 'EDM', change: '+22%' },
    { rank: 5, name: 'Country Roads', listeners: 2900, genre: 'Country', change: '+5%' },
  ];

  useEffect(() => {
    // Simulate station rotation
    const interval = setInterval(() => {
      setCurrentStation((prev) => (prev + 1) % featuredStations.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 p-8 md:p-12 mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Launching v2.0 - New features available!</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Broadcast{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Excellence
              </span>
              <br />
              For Modern Radio
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Professional radio broadcasting platform with studio-grade audio, 
              real-time analytics, and seamless content management for media groups worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] font-semibold"
              >
                Start Broadcasting
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Player */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            Live Now
          </h2>
          <Link href="/live" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all stations
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Station */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${featuredStations[currentStation].color} opacity-20`} />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mb-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm">LIVE</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{featuredStations[currentStation].name}</h3>
                  <p className="text-gray-400">{featuredStations[currentStation].genre}</p>
                </div>
                <button className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Music className="h-4 w-4" />
                  <span className="truncate">{featuredStations[currentStation].currentTrack}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="h-4 w-4" />
                  <span>{featuredStations[currentStation].listeners.toLocaleString()} listeners</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-2/3"></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>2:30</span>
                    <span>3:45</span>
                  </div>
                </div>

                {/* Player Controls */}
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

          {/* Station List */}
          <div className="space-y-4">
            {featuredStations.map((station, index) => (
              <div
                key={station.id}
                onClick={() => setCurrentStation(index)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  currentStation === index
                    ? 'border-purple-500/50 bg-gray-800/30'
                    : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${station.color} flex items-center justify-center`}>
                    <Radio className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{station.name}</h4>
                      {station.live && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{station.genre}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <Users className="h-3 w-3" />
                      {station.listeners.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">listeners</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gray-800/50">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
              <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change} this month
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose RadioWave?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional tools and features designed specifically for modern radio broadcasting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]">
                <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-bl from-purple-600/10 to-transparent rounded-full blur-2xl" />
                <div className={`mb-4 p-3 rounded-xl bg-gray-800/50 w-fit ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Stations & CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Top Stations */}
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
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                      {station.genre}
                    </span>
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

        {/* CTA Section */}
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
    </>
  );
}