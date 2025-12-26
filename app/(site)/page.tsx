"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Mic2, Music, Globe, Shield, BarChart3, TrendingUp } from 'lucide-react';

import { Hero } from '@/components/home/Hero';
import { LivePlayer } from '@/components/home/LivePlayer';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TopStationsCTA } from '@/components/home/TopStationsCTA';
import { SectionDivider } from '@/components/layout/SectionDivider';
import { WaveDivider } from '@/components/layout/WaveDivider';
import { ServicesSection } from '@/components/home/ServicesSection';

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
      bitrate: '128 kbps',
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
      bitrate: '192 kbps',
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
      bitrate: '320 kbps',
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
      bitrate: '256 kbps',
      live: true
    },
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: 'Active Users', value: '10,458', change: '+12%' },
    { icon: <Music className="h-6 w-6" />, label: 'Stations', value: '256', change: '+5' },
    { icon: <Globe className="h-6 w-6" />, label: 'Countries', value: '42', change: '+3' },
    { icon: <TrendingUp className="h-6 w-6" />, label: 'Stream Hours', value: '1.2M', change: '+24%' },
  ];

  const features = [
    {
      id: 1,
      icon: <Mic2 className="h-8 w-8" />,
      title: 'Professional Broadcasting',
      description: 'Studio-grade audio quality with multi-format support',
      color: 'from-purple-500 to-indigo-600',
      darkColor: 'from-purple-400 to-indigo-500',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 2,
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Reliable',
      description: '99.9% uptime with enterprise-grade security',
      color: 'from-blue-500 to-cyan-600',
      darkColor: 'from-blue-400 to-cyan-500',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description: 'Real-time listener insights and performance metrics',
      color: 'from-green-500 to-emerald-600',
      darkColor: 'from-green-400 to-emerald-500',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 4,
      icon: <Music className="h-8 w-8" />,
      title: 'Media Management',
      description: 'Smart playlist automation and content scheduling',
      color: 'from-rose-500 to-pink-600',
      darkColor: 'from-rose-400 to-pink-500',
      gradient: 'from-rose-500 to-pink-600'
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
    
    const interval = setInterval(() => {
      setCurrentStation((prev) => (prev + 1) % featuredStations.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Hero />
      <SectionDivider />
      <ServicesSection />

       <LivePlayer
        featuredStations={featuredStations}
        currentStation={currentStation}
        setCurrentStation={setCurrentStation}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
        setVolume={setVolume}
      />

      <StatsSection stats={stats} />

      <FeaturesSection features={features} />
{/*
      <TopStationsCTA topStations={topStations} /> */}
    </>
  );
}