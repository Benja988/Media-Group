"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Mic2,
  Music,
  Globe,
  Shield,
  BarChart3,
  TrendingUp,Radio, Zap, Clock, 
  Wifi, Monitor, Satellite, Award, Sparkles,
  CheckCircle, Signal, AudioWaveform, Heart, Cloud, Headphones,
} from "lucide-react";


import { Hero } from "@/components/home/Hero";
import { LivePlayer } from "@/components/home/LivePlayer";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TopStationsCTA } from "@/components/home/TopStationsCTA";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { WaveDivider } from "@/components/layout/WaveDivider";
import { ServicesSection } from "@/components/home/ServicesSection";

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [volume, setVolume] = useState(80);

  const featuredStations = [
    {
      id: 1,
      name: "Pure Lounge",
      genre: "Chillout • Lo-fi • Ambient",
      listeners: 2450,
      currentTrack: "Midnight City - M83",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800",
      color: "from-purple-600 to-pink-600",
      lightColor: "from-purple-600 to-pink-600",
      darkColor: "from-purple-500 to-pink-500",
      bitrate: "128 kbps",
      live: true,
    },
    {
      id: 2,
      name: "Energy FM",
      genre: "EDM • House • Dance",
      listeners: 3200,
      currentTrack: "Don't You Worry Child - Swedish House Mafia",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800",
      color: "from-orange-600 to-red-600",
      lightColor: "from-orange-600 to-red-600",
      darkColor: "from-orange-500 to-red-500",
      bitrate: "192 kbps",
      live: true,
    },
  ];

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      label: "Active Users",
      value: "10,458",
      change: "+12%",
    },
    {
      icon: <Music className="h-6 w-6" />,
      label: "Stations",
      value: "256",
      change: "+5",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      label: "Countries",
      value: "42",
      change: "+3",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: "Stream Hours",
      value: "1.2M",
      change: "+24%",
    },
  ];

  const features = [
  {
    id: 1,
    icon: <Mic2 className="h-8 w-8" />,
    title: "Professional Broadcasting",
    description: "Studio-grade audio quality with multi-format support and lossless encoding for pristine sound reproduction.",
    lightColor: "from-blue-600 to-blue-500",
    darkColor: "from-blue-500 to-blue-400",
    gradient: "from-blue-600 to-blue-500",
    features: [
      "Lossless audio encoding",
      "HD streaming up to 320kbps",
      "Multi-format support (MP3, AAC, FLAC)",
      "Dynamic range compression",
      "Noise reduction technology",
      "Automatic gain control"
    ],
    technology: ["AAC+", "OPUS", "MP3", "FLAC", "WAV"],
    stats: "384kbps Max Quality",
    testimonials: [
      "Our listeners immediately noticed the improved audio quality.",
      "The broadcast clarity is unmatched in the industry."
    ]
  },
  {
    id: 2,
    icon: <Shield className="h-8 w-8" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.99% uptime guarantee and comprehensive data protection measures.",
    lightColor: "from-blue-500 to-indigo-500",
    darkColor: "from-blue-400 to-indigo-400",
    gradient: "from-blue-500 to-indigo-500",
    features: [
      "AES-256 encryption",
      "DDoS protection",
      "SSL/TLS security",
      "Compliance ready (GDPR, CCPA)",
      "Regular security audits",
      "Two-factor authentication"
    ],
    technology: ["AES-256", "RSA-2048", "TLS 1.3", "WAF", "DDoS Mitigation"],
    stats: "99.99% Uptime",
    testimonials: [
      "Never experienced downtime during critical broadcasts.",
      "Bank-level security for peace of mind."
    ]
  },
  {
    id: 3,
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Real-time listener insights, performance metrics, and comprehensive audience analytics dashboard.",
    lightColor: "from-blue-600 to-blue-400",
    darkColor: "from-blue-500 to-blue-300",
    gradient: "from-blue-600 to-blue-400",
    features: [
      "Live audience dashboard",
      "Demographic analytics",
      "Engagement metrics tracking",
      "Geographic distribution",
      "Peak listener times",
      "Content performance reports"
    ],
    technology: ["WebSocket", "Redis", "PostgreSQL", "D3.js", "Chart.js"],
    stats: "< 5s Latency",
    testimonials: [
      "Transformed how we understand our audience engagement.",
      "Real-time data helps us make immediate content decisions."
    ]
  },
  {
    id: 4,
    icon: <Music className="h-8 w-8" />,
    title: "Media Management",
    description: "Smart playlist automation, content scheduling, and intelligent media library management system.",
    lightColor: "from-blue-500 to-teal-500",
    darkColor: "from-blue-400 to-teal-400",
    gradient: "from-blue-500 to-teal-500",
    features: [
      "Smart playlist automation",
      "Advanced content scheduling",
      "Media library management",
      "Auto-rotation systems",
      "Content categorization",
      "Batch upload & processing"
    ],
    technology: ["FFmpeg", "SoX", "ID3 Tags", "Metadata", "Auto-tagging"],
    stats: "Unlimited Storage",
    testimonials: [
      "Scheduling content has never been easier.",
      "Automated playlist generation saved us hours daily."
    ]
  },
  {
    id: 5,
    icon: <Globe className="h-8 w-8" />,
    title: "Global Distribution",
    description: "Multi-CDN infrastructure with low-latency streaming network covering 200+ global locations.",
    lightColor: "from-blue-600 to-cyan-500",
    darkColor: "from-blue-500 to-cyan-400",
    gradient: "from-blue-600 to-cyan-500",
    features: [
      "200+ CDN locations worldwide",
      "Low latency streaming",
      "Automatic failover systems",
      "Geographic load balancing",
      "Multi-region redundancy",
      "Edge computing capabilities"
    ],
    technology: ["Cloudflare", "Akamai", "Fastly", "AWS CloudFront", "GCP CDN"],
    stats: "99.9% Global Coverage",
    testimonials: [
      "Seamless broadcasting to 50+ countries without issues.",
      "Our international audience gets the same high-quality stream."
    ]
  },
  {
    id: 6,
    icon: <Users className="h-8 w-8" />,
    title: "Team Collaboration",
    description: "Multi-user access control, role-based permissions, and collaborative workflow management.",
    lightColor: "from-blue-500 to-purple-500",
    darkColor: "from-blue-400 to-purple-400",
    gradient: "from-blue-500 to-purple-500",
    features: [
      "Multi-user access control",
      "Role-based permissions",
      "Collaborative workflow",
      "User activity tracking",
      "Team management tools",
      "Shared media libraries"
    ],
    technology: ["RBAC", "OAuth 2.0", "JWT", "Session Management", "Audit Logs"],
    stats: "Unlimited Users",
    testimonials: [
      "Perfect for our distributed team of broadcasters.",
      "Role-based permissions keep our workflow secure and organized."
    ]
  },
  {
    id: 7,
    icon: <Zap className="h-8 w-8" />,
    title: "Live Streaming",
    description: "High-performance live streaming with adaptive bitrate and real-time monitoring capabilities.",
    lightColor: "from-blue-600 to-blue-300",
    darkColor: "from-blue-500 to-blue-200",
    gradient: "from-blue-600 to-blue-300",
    features: [
      "Adaptive bitrate streaming",
      "Real-time monitoring",
      "Live event scheduling",
      "Multi-camera support",
      "Live chat integration",
      "Stream quality optimization"
    ],
    technology: ["HLS", "DASH", "RTMP", "WebRTC", "Adaptive Streaming"],
    stats: "4K Streaming",
    testimonials: [
      "The adaptive streaming works flawlessly on all devices.",
      "Live events have never been smoother to manage."
    ]
  },
  {
    id: 8,
    icon: <Cloud className="h-8 w-8" />,
    title: "Cloud Infrastructure",
    description: "Scalable cloud infrastructure with automatic scaling and comprehensive backup solutions.",
    lightColor: "from-blue-500 to-gray-500",
    darkColor: "from-blue-400 to-gray-400",
    gradient: "from-blue-500 to-gray-500",
    features: [
      "Automatic scaling",
      "Comprehensive backup",
      "Disaster recovery",
      "Resource optimization",
      "Cost management",
      "Performance monitoring"
    ],
    technology: ["AWS", "Google Cloud", "Azure", "Kubernetes", "Docker"],
    stats: "Auto-scaling",
    testimonials: [
      "Handles traffic spikes without any performance issues.",
      "The cloud infrastructure scales perfectly with our growth."
    ]
  },
  {
    id: 9,
    icon: <Headphones className="h-8 w-8" />,
    title: "Audio Processing",
    description: "Advanced audio processing with noise reduction, equalization, and professional effects chain.",
    lightColor: "from-blue-600 to-blue-400",
    darkColor: "from-blue-500 to-blue-300",
    gradient: "from-blue-600 to-blue-400",
    features: [
      "Professional EQ & compression",
      "Noise reduction",
      "Audio normalization",
      "Multi-band processing",
      "Effects chain",
      "Audio restoration"
    ],
    technology: ["VST", "AU", "LV2", "SoX", "FFmpeg Filters"],
    stats: "24-bit Processing",
    testimonials: [
      "The audio processing tools rival professional studio software.",
      "Our live shows sound like they were professionally mixed."
    ]
  },
  {
    id: 10,
    icon: <Radio className="h-8 w-8" />,
    title: "Multi-Platform",
    description: "Broadcast simultaneously to web, mobile apps, smart speakers, and traditional radio networks.",
    lightColor: "from-blue-500 to-blue-600",
    darkColor: "from-blue-400 to-blue-500",
    gradient: "from-blue-500 to-blue-600",
    features: [
      "Web streaming player",
      "Mobile apps (iOS/Android)",
      "Smart speaker integration",
      "Traditional radio networks",
      "Social media streaming",
      "Podcast distribution"
    ],
    technology: ["React Native", "Swift", "Kotlin", "Alexa Skills", "Google Assistant"],
    stats: "10+ Platforms",
    testimonials: [
      "Reaching audiences across all platforms seamlessly.",
      "The mobile apps have significantly increased our listener base."
    ]
  },
  {
    id: 11,
    icon: <Clock className="h-8 w-8" />,
    title: "24/7 Support",
    description: "Round-the-clock expert support with dedicated account managers and comprehensive documentation.",
    lightColor: "from-blue-600 to-green-500",
    darkColor: "from-blue-500 to-green-400",
    gradient: "from-blue-600 to-green-500",
    features: [
      "24/7 expert support",
      "Dedicated account managers",
      "Comprehensive documentation",
      "Video tutorials",
      "Community forums",
      "Regular webinars"
    ],
    technology: ["Zendesk", "Intercom", "Slack", "Jira", "Confluence"],
    stats: "< 15min Response",
    testimonials: [
      "The support team is incredibly responsive and helpful.",
      "Saved us during a critical broadcast issue."
    ]
  },
  {
    id: 12,
    icon: <Award className="h-8 w-8" />,
    title: "Enterprise Grade",
    description: "Professional features designed for large-scale broadcasting with custom SLAs and premium support.",
    lightColor: "from-blue-600 to-yellow-500",
    darkColor: "from-blue-500 to-yellow-400",
    gradient: "from-blue-600 to-yellow-500",
    features: [
      "Custom SLAs",
      "Premium support",
      "Dedicated infrastructure",
      "Custom integrations",
      "Training & onboarding",
      "Quarterly reviews"
    ],
    technology: ["Custom API", "White Label", "Enterprise SSO", "Advanced Analytics"],
    stats: "Enterprise SLA",
    testimonials: [
      "The enterprise features perfectly fit our large organization.",
      "Custom integrations made our workflow seamless."
    ]
  }
];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStation(
        (prev) => (prev + 1) % featuredStations.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [featuredStations.length]);

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

      {/* <StatsSection stats={stats} /> */}
      <FeaturesSection features={features} />

      {/*
      <TopStationsCTA topStations={topStations} />
      */}
    </>
  );
}
