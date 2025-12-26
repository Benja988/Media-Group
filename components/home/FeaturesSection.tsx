import React, { useState } from 'react';
import { Sparkles, Zap, Shield, Globe, TrendingUp, Headphones, Radio, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  darkColor: string;
  gradient: string;
  stats?: string;
  features?: string[];
}

interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float-slower" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container-width relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Why Choose RadioWave
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Broadcast with</span>{' '}
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                Confidence
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional tools and cutting-edge features designed specifically for modern radio broadcasting
            and media streaming.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {features.map((feature) => {
            const isHovered = hoveredFeature === feature.id;
            
            return (
              <div
                key={feature.id}
                className="relative group"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Feature Card */}
                <div className="relative h-full p-6 md:p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                  {/* Background Layers */}
                  <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Border Animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-300 dark:group-hover:border-purple-700 transition-all duration-500" />
                  
                  {/* Animated Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.gradient} opacity-0 group-hover:opacity-20 rotate-45 -translate-y-16 translate-x-16 transition-opacity duration-500`} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="mb-6">
                      <div className="relative">
                        {/* Icon Background Glow */}
                        <div className={`absolute -inset-3 bg-gradient-to-br ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                        
                        {/* Icon Container */}
                        <div className={`relative p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Features List */}
                    {feature.features && (
                      <div className="space-y-2 mb-6">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats (if present) */}
                    {feature.stats && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {feature.stats}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Element on Hover */}
                {isHovered && (
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur animate-ping" />
                      <div className="relative p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Banner */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-pink-600/20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
          
          <div className="relative p-8 md:p-12 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '99.9%', label: 'Uptime Guarantee', icon: Shield, color: 'text-purple-600 dark:text-purple-400' },
                { value: '150+', label: 'Countries Served', icon: Globe, color: 'text-blue-600 dark:text-blue-400' },
                { value: '50K+', label: 'Active Streams', icon: Radio, color: 'text-pink-600 dark:text-pink-400' },
                { value: '10M+', label: 'Daily Listeners', icon: Users, color: 'text-cyan-600 dark:text-cyan-400' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center group">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="absolute -inset-3 bg-white/50 dark:bg-gray-800/50 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className={`relative p-3 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm ${stat.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Ready to Start Broadcasting?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join thousands of successful broadcasters using RadioWave
              </p>
            </div>
            <button className="group/btn relative px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
            </button>
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
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(0.5deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

// Example features data structure
export const sampleFeatures: Feature[] = [
  {
    id: 1,
    title: 'Studio-Grade Audio',
    description: 'Broadcast with crystal-clear audio quality using our professional streaming infrastructure.',
    icon: <Headphones className="h-6 w-6" />,
    color: 'from-purple-500 to-indigo-600',
    darkColor: 'from-purple-400 to-indigo-500',
    gradient: 'from-purple-500 to-indigo-600',
    features: ['Lossless Audio', 'HD Streaming', 'No Compression'],
    stats: '384kbps'
  },
  {
    id: 2,
    title: 'Real-Time Analytics',
    description: 'Monitor your audience with live analytics and detailed listener insights.',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-600',
    darkColor: 'from-blue-400 to-cyan-500',
    gradient: 'from-blue-500 to-cyan-600',
    features: ['Live Dashboard', 'Audience Demographics', 'Engagement Metrics'],
    stats: 'Real-time'
  },
  {
    id: 3,
    title: 'Global Distribution',
    description: 'Reach audiences worldwide with our multi-CDN infrastructure and low-latency streaming.',
    icon: <Globe className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-600',
    darkColor: 'from-green-400 to-emerald-500',
    gradient: 'from-green-500 to-emerald-600',
    features: ['200+ CDNs', 'Low Latency', 'Global Coverage'],
    stats: '99.9% Uptime'
  },
  {
    id: 4,
    title: 'Enterprise Security',
    description: 'Protect your broadcasts with military-grade encryption and secure infrastructure.',
    icon: <Shield className="h-6 w-6" />,
    color: 'from-rose-500 to-pink-600',
    darkColor: 'from-rose-400 to-pink-500',
    gradient: 'from-rose-500 to-pink-600',
    features: ['AES-256 Encryption', 'DDoS Protection', 'Compliance Ready'],
    stats: 'Bank-Level'
  }
];