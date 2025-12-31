import { useState, useEffect } from 'react';
import { 
  Radio, Tv, Mic, Wifi, Volume2, MonitorSmartphone, 
  Sparkles, Zap, TrendingUp, Shield, Globe, Headphones,
  ArrowRight, Play, Calendar, Users, Music, AudioWaveform
} from 'lucide-react';

// Service data with Unsplash images using blue theme
export const servicesData = [
  {
    id: 1,
    title: 'Radio Broadcasting',
    description: 'Reach millions through professional FM and online radio stations with studio-grade audio quality and global distribution.',
    icon: Radio,
    gradient: 'from-blue-600 to-blue-500',
    lightColor: 'from-blue-600 to-blue-500',
    darkColor: 'from-blue-400 to-blue-300',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    features: ['HD Audio Streaming', 'Global Distribution', '24/7 Support'],
    stats: '99.9% Uptime',
    accentColor: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'TV Production',
    description: 'High-quality TV content for news, entertainment, and documentaries with professional studio equipment and editing.',
    icon: Tv,
    gradient: 'from-blue-500 to-cyan-500',
    lightColor: 'from-blue-500 to-cyan-500',
    darkColor: 'from-blue-400 to-cyan-400',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop',
    features: ['4K Production', 'Live Broadcast', 'Post Production'],
    stats: '100+ Productions',
    accentColor: 'bg-blue-400'
  },
  {
    id: 3,
    title: 'Live Streaming',
    description: 'Stream your events live with seamless performance, HD quality, and real-time analytics dashboard.',
    icon: Wifi,
    gradient: 'from-blue-600 to-blue-400',
    lightColor: 'from-blue-600 to-blue-400',
    darkColor: 'from-blue-500 to-blue-300',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop',
    features: ['Multi-platform', 'Real-time Analytics', 'Interactive Features'],
    stats: '50K+ Concurrent',
    accentColor: 'bg-blue-300'
  },
  {
    id: 4,
    title: 'Podcasting',
    description: 'Record, edit, and distribute podcasts to engage global audiences with professional audio engineering.',
    icon: Mic,
    gradient: 'from-blue-500 to-indigo-500',
    lightColor: 'from-blue-500 to-indigo-500',
    darkColor: 'from-blue-400 to-indigo-400',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
    features: ['Studio Recording', 'Audio Editing', 'Distribution'],
    stats: '1M+ Downloads',
    accentColor: 'bg-indigo-500'
  },
  {
    id: 5,
    title: 'Advertising Solutions',
    description: 'Custom ad campaigns across radio, TV, and digital platforms with targeted audience reach.',
    icon: Volume2,
    gradient: 'from-blue-600 to-teal-500',
    lightColor: 'from-blue-600 to-teal-500',
    darkColor: 'from-blue-500 to-teal-400',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop',
    features: ['Targeted Ads', 'Performance Tracking', 'Multi-platform'],
    stats: '300% ROI Average',
    accentColor: 'bg-teal-500'
  },
  {
    id: 6,
    title: 'Digital Media Marketing',
    description: 'Boost your brand with targeted online marketing strategies and comprehensive analytics.',
    icon: MonitorSmartphone,
    gradient: 'from-blue-500 to-purple-500',
    lightColor: 'from-blue-500 to-purple-500',
    darkColor: 'from-blue-400 to-purple-400',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    features: ['SEO Optimization', 'Social Media', 'Analytics'],
    stats: '90% Engagement Rate',
    accentColor: 'bg-purple-500'
  }
];

export function ServicesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All Services', icon: Sparkles },
    { id: 'broadcast', label: 'Broadcast', icon: Radio },
    { id: 'production', label: 'Production', icon: Tv },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-[#0a1521] dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-100/20 dark:from-blue-900/5 dark:via-transparent dark:to-blue-900/10" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-300/10 to-transparent rounded-full blur-3xl animate-float-slower" />
        
        {/* Signal Dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/5"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
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
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-gray-900/80 dark:to-gray-950/80 border-blue-500/30 dark:border-blue-400/20 mb-6 md:mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur bg-blue-600/30 dark:bg-blue-500/30" />
              <Sparkles className="relative h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              Professional Media Services
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8">
            <span className="text-gray-900 dark:text-white">Broadcast with</span>{' '}
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
                Excellence
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1 rounded-full transform scale-x-0 animate-grow bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300" />
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive media solutions powered by cutting-edge technology and industry expertise. 
            From broadcasting to production, we deliver studio-grade quality worldwide.
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
          {servicesData.map((service) => {
            const Icon = service.icon;
            const isHovered = hoveredCard === service.id;
            
            return (
              <div
                key={service.id}
                className="group relative h-full"
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Container */}
                <div className="relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/30 dark:border-gray-800 transition-all duration-500 hover:border-blue-500/50 dark:hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Animated Background Gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${service.lightColor} dark:${service.darkColor} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-44 md:h-52 overflow-hidden">
                    {/* Unsplash Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent dark:from-gray-950/90 dark:via-gray-950/50" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`relative p-3 rounded-xl bg-gradient-to-br ${service.lightColor} dark:${service.darkColor} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${service.lightColor} dark:${service.darkColor} opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300`} />
                      </div>
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                        <span className="text-sm font-semibold text-white">{service.stats}</span>
                      </div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-500 group-hover:bg-clip-text dark:group-hover:from-blue-400 dark:group-hover:to-blue-300 transition-all duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed flex-grow">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-gray-800 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-gray-700"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${service.accentColor}`} />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <button className="group/btn w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-blue-900 dark:text-blue-300 hover:text-white transition-all duration-300 overflow-hidden">
                      <span className="relative z-10">Explore Service</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      
                      {/* Animated Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.lightColor} dark:${service.darkColor} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Border Animation */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover/btn:border-white/30 transition-all duration-300" />
                    </button>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${service.lightColor} dark:${service.darkColor} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 rotate-45 -translate-y-20 translate-x-20 transition-opacity duration-500`} />
                  </div>
                </div>

                {/* Floating Element (Appears on hover) */}
                {isHovered && (
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full blur animate-ping" />
                      <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 md:mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: '500+', label: 'Professional Stations', icon: Radio },
              { value: '10M+', label: 'Monthly Listeners', icon: Users },
              { value: '150+', label: 'Countries Served', icon: Globe },
              { value: '24/7', label: 'Expert Support', icon: Calendar },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-gray-900/70 dark:to-gray-950/70 border-blue-500/30 dark:border-blue-400/20 hover:border-blue-500/50 dark:hover:border-blue-500/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 border border-blue-500/30 dark:border-blue-500/50">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-800/80 dark:text-blue-300/80">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        @keyframes grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        .animate-grow { animation: grow 1s ease-out forwards; animation-delay: 0.5s; }
      `}</style>
    </section>
  );
}