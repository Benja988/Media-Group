import React, { useState } from 'react';
import { Sparkles, Zap, Shield, Globe, TrendingUp, Headphones, Radio, Users, CheckCircle, ArrowRight, Award, Clock, Wifi, Satellite, Cloud, AudioWaveform, Mic, Monitor, Heart, Star } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  lightColor: string;
  darkColor: string;
  gradient: string;
  features?: string[];
  stats?: string;
  testimonials?: string[];
  technology?: string[];
}

interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All Features', icon: Sparkles },
    { id: 'audio', label: 'Audio Quality', icon: Headphones },
    { id: 'infrastructure', label: 'Infrastructure', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-[#0a1521] dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-100/20 dark:from-blue-900/5 dark:via-transparent dark:to-blue-900/10" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl animate-float" />
        
        {/* Signal Dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
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
        <div className="text-center mb-12 md:mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-gray-900/80 dark:to-gray-950/80 border-blue-500/30 dark:border-blue-400/20 mb-6 md:mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur bg-blue-600/30 dark:bg-blue-500/30" />
              <Sparkles className="relative h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              Enterprise Broadcast Platform
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
            <span className="text-gray-900 dark:text-white">Broadcast with</span>{' '}
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
                Professional Edge
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1 rounded-full transform scale-x-0 animate-grow bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300" />
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive broadcast solutions powered by cutting-edge technology, designed for professional 
            media organizations and individual creators alike. Experience studio-grade quality at scale.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`group flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/70 dark:bg-gray-800/70 text-blue-900 dark:text-blue-300 hover:bg-white dark:hover:bg-gray-800 border border-blue-200/50 dark:border-gray-700'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 ${
                  isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                }`} />
                <span>{category.label}</span>
                {isActive && (
                  <div className="ml-1 w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {features.map((feature) => {
            const isHovered = hoveredFeature === feature.id;
            
            return (
              <div
                key={feature.id}
                className="relative group h-full"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Feature Card */}
                <div className="relative h-full p-6 md:p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/30">
                  {/* Background Layers */}
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500`} />
                  
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  
                  {/* Animated Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 rotate-45 -translate-y-20 translate-x-20 transition-opacity duration-500`} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon Container */}
                    <div className="mb-6">
                      <div className="relative">
                        {/* Icon Background Glow */}
                        <div className={`absolute -inset-3 bg-gradient-to-br ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                        
                        {/* Icon Container */}
                        <div className={`relative p-4 rounded-xl bg-gradient-to-br ${feature.lightColor} dark:${feature.darkColor} shadow-lg`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-500 group-hover:bg-clip-text dark:group-hover:from-blue-400 dark:group-hover:to-blue-300 transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Features List */}
                    {feature.features && (
                      <div className="space-y-3 mb-6">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-400 leading-tight">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technology Stack */}
                    {feature.technology && (
                      <div className="mt-4 pt-4 border-t border-blue-200/30 dark:border-gray-800">
                        <div className="text-xs font-semibold text-blue-700/80 dark:text-blue-300/80 mb-2">Technology Stack</div>
                        <div className="flex flex-wrap gap-2">
                          {feature.technology.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-lg text-xs bg-blue-50/50 dark:bg-gray-800/50 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats (if present) */}
                    {feature.stats && (
                      <div className="mt-6 pt-4 border-t border-blue-200/30 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Performance Metric</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                              {feature.stats}
                            </div>
                          </div>
                          <Award className="h-6 w-6 text-blue-500/80 dark:text-blue-400/80" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Element on Hover */}
                {isHovered && (
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full blur animate-ping" />
                      <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Showcase */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Technology Stack */}
            <div className="rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30">
                  <Wifi className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Technology Stack</h3>
                  <p className="text-blue-700/80 dark:text-blue-300/80">Powered by industry-leading solutions</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cloud, label: 'Cloud Infrastructure', desc: 'AWS, Google Cloud, Azure' },
                  { icon: Satellite, label: 'CDN Network', desc: '200+ global edge locations' },
                  { icon: Shield, label: 'Security', desc: 'AES-256, DDoS protection' },
                  { icon: Monitor, label: 'Monitoring', desc: '24/7 real-time monitoring' },
                ].map((tech, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-blue-50/50 dark:bg-gray-800/50 border border-blue-200/30 dark:border-gray-700/50">
                    <tech.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <div className="font-medium text-gray-900 dark:text-white">{tech.label}</div>
                    <div className="text-sm text-blue-700/80 dark:text-blue-300/80">{tech.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Performance Metrics */}
            <div className="rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Metrics</h3>
                  <p className="text-blue-700/80 dark:text-blue-300/80">Industry-leading reliability & speed</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Uptime Reliability', value: '99.99%', color: 'from-green-500 to-green-400' },
                  { label: 'Audio Latency', value: '< 45ms', color: 'from-blue-500 to-blue-400' },
                  { label: 'Stream Quality', value: 'HD 320kbps', color: 'from-purple-500 to-purple-400' },
                  { label: 'Global Coverage', value: '200+ Regions', color: 'from-cyan-500 to-cyan-400' },
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-blue-100 dark:bg-gray-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000`}
                        style={{ width: `${90 + Math.random() * 8}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trusted by Broadcast Professionals</h3>
            <p className="text-gray-600 dark:text-gray-300">What industry leaders say about our platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The audio quality is studio-grade. Our listeners notice the difference immediately.",
                author: "Sarah Chen",
                role: "Radio Station Manager",
                rating: 5
              },
              {
                quote: "Real-time analytics transformed how we understand our audience engagement.",
                author: "Michael Rodriguez",
                role: "Content Director",
                rating: 5
              },
              {
                quote: "Global distribution works seamlessly. We're broadcasting to 50+ countries without issues.",
                author: "Emma Williams",
                role: "Broadcast Engineer",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-6 rounded-2xl backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/10">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                    <div className="text-sm text-blue-700/80 dark:text-blue-300/80">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-5" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
            
            <div className="relative p-8 md:p-12 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Elevate Your Broadcast?
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Join thousands of professional broadcasters who trust our platform for their most important streams.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>30-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>24/7 expert support</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group/btn relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                  </button>
                  <button className="px-8 py-4 rounded-xl backdrop-blur-xl border font-semibold transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-gray-900/70 dark:to-gray-950/70 border-blue-500/30 dark:border-blue-400/20 hover:border-blue-500/50 dark:hover:border-blue-500/30 text-blue-900 dark:text-blue-100">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-1deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        @keyframes grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-grow { animation: grow 1s ease-out forwards; animation-delay: 0.5s; }
      `}</style>
    </section>
  );
}

// Updated sample features data with blue theme
export const sampleFeatures: Feature[] = [
  {
    id: 1,
    title: 'Studio-Grade Audio',
    description: 'Broadcast with crystal-clear audio quality using our professional streaming infrastructure with lossless encoding.',
    icon: <Headphones className="h-6 w-6" />,
    lightColor: 'from-blue-600 to-blue-500',
    darkColor: 'from-blue-500 to-blue-400',
    gradient: 'from-blue-600 to-blue-500',
    features: [
      'Lossless Audio Encoding',
      'HD Streaming up to 320kbps',
      'Dynamic Range Compression',
      'Noise Reduction Technology'
    ],
    technology: ['AAC+', 'OPUS', 'MP3', 'FLAC'],
    stats: '384kbps Max'
  },
  {
    id: 2,
    title: 'Real-Time Analytics',
    description: 'Monitor your audience with comprehensive live analytics and detailed listener insights dashboard.',
    icon: <TrendingUp className="h-6 w-6" />,
    lightColor: 'from-blue-500 to-cyan-500',
    darkColor: 'from-blue-400 to-cyan-400',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Live Audience Dashboard',
      'Demographic Analytics',
      'Engagement Metrics',
      'Geographic Distribution'
    ],
    technology: ['WebSocket', 'Redis', 'PostgreSQL', 'D3.js'],
    stats: '< 5s Latency'
  },
  {
    id: 3,
    title: 'Global Distribution',
    description: 'Reach audiences worldwide with our multi-CDN infrastructure and low-latency streaming network.',
    icon: <Globe className="h-6 w-6" />,
    lightColor: 'from-blue-600 to-blue-400',
    darkColor: 'from-blue-500 to-blue-300',
    gradient: 'from-blue-600 to-blue-400',
    features: [
      '200+ CDN Locations',
      'Low Latency Streaming',
      'Automatic Failover',
      'Geographic Load Balancing'
    ],
    technology: ['Cloudflare', 'Akamai', 'Fastly', 'AWS CloudFront'],
    stats: '99.99% Uptime'
  },
  {
    id: 4,
    title: 'Enterprise Security',
    description: 'Protect your broadcasts with military-grade encryption and enterprise security infrastructure.',
    icon: <Shield className="h-6 w-6" />,
    lightColor: 'from-blue-500 to-indigo-500',
    darkColor: 'from-blue-400 to-indigo-400',
    gradient: 'from-blue-500 to-indigo-500',
    features: [
      'AES-256 Encryption',
      'DDoS Protection',
      'SSL/TLS Security',
      'Compliance Ready'
    ],
    technology: ['AES-256', 'RSA-2048', 'TLS 1.3', 'WAF'],
    stats: 'Bank-Level'
  }
];