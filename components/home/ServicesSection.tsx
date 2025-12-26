import { useState, useEffect } from 'react';
import { 
  Radio, Tv, Mic, Wifi, Volume2, MonitorSmartphone, 
  Sparkles, Zap, TrendingUp, Shield, Globe, Headphones,
  ArrowRight, Play,
  User2
} from 'lucide-react';

// Service data with Unsplash images
export const servicesData = [
  {
    id: 1,
    title: 'Radio Broadcasting',
    description: 'Reach millions through professional FM and online radio stations with studio-grade audio quality and global distribution.',
    icon: Radio,
    color: 'from-purple-500 to-indigo-600',
    darkColor: 'from-purple-400 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    features: ['HD Audio Streaming', 'Global Distribution', '24/7 Support'],
    stats: '99.9% Uptime'
  },
  {
    id: 2,
    title: 'TV Production',
    description: 'High-quality TV content for news, entertainment, and documentaries with professional studio equipment and editing.',
    icon: Tv,
    color: 'from-blue-500 to-cyan-600',
    darkColor: 'from-blue-400 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w-800&auto=format&fit=crop',
    features: ['4K Production', 'Live Broadcast', 'Post Production'],
    stats: '100+ Productions'
  },
  {
    id: 3,
    title: 'Live Streaming',
    description: 'Stream your events live with seamless performance, HD quality, and real-time analytics dashboard.',
    icon: Wifi,
    color: 'from-green-500 to-emerald-600',
    darkColor: 'from-green-400 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop',
    features: ['Multi-platform', 'Real-time Analytics', 'Interactive Features'],
    stats: '50K+ Concurrent'
  },
  {
    id: 4,
    title: 'Podcasting',
    description: 'Record, edit, and distribute podcasts to engage global audiences with professional audio engineering.',
    icon: Mic,
    color: 'from-rose-500 to-pink-600',
    darkColor: 'from-rose-400 to-pink-500',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
    features: ['Studio Recording', 'Audio Editing', 'Distribution'],
    stats: '1M+ Downloads'
  },
  {
    id: 5,
    title: 'Advertising Solutions',
    description: 'Custom ad campaigns across radio, TV, and digital platforms with targeted audience reach.',
    icon: Volume2,
    color: 'from-amber-500 to-orange-600',
    darkColor: 'from-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop',
    features: ['Targeted Ads', 'Performance Tracking', 'Multi-platform'],
    stats: '300% ROI Average'
  },
  {
    id: 6,
    title: 'Digital Media Marketing',
    description: 'Boost your brand with targeted online marketing strategies and comprehensive analytics.',
    icon: MonitorSmartphone,
    color: 'from-violet-500 to-purple-600',
    darkColor: 'from-violet-400 to-purple-500',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    features: ['SEO Optimization', 'Social Media', 'Analytics'],
    stats: '90% Engagement Rate'
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
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-transparent rounded-full blur-3xl animate-float-slower" />
      </div>

      <div className="container-width relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Premium Services
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Elevate Your</span>{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
              Media Presence
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive media solutions powered by cutting-edge technology and industry expertise.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 ${
                  isActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                }`} />
                <span>{category.label}</span>
                {isActive && (
                  <div className="ml-2 w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((service) => {
            const Icon = service.icon;
            const isHovered = hoveredCard === service.id;
            
            return (
              <div
                key={service.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Container */}
                <div className="relative h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:border-transparent hover:shadow-2xl">
                  {/* Animated Background Gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    {/* Unsplash Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`relative p-3 rounded-xl bg-gradient-to-br ${service.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                      </div>
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                        <span className="text-sm font-semibold text-white">{service.stats}</span>
                      </div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`} />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <button className="group/btn w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 overflow-hidden">
                      <span className="relative z-10">Explore Service</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      
                      {/* Animated Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Border Animation */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover/btn:border-white/30 transition-all duration-300" />
                    </button>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${service.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 rotate-45 -translate-y-16 translate-x-16 transition-opacity duration-500`} />
                  </div>
                </div>

                {/* Floating Element (Appears on hover) */}
                {isHovered && (
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur animate-ping" />
                      <div className="relative p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 dark:from-purple-500/20 dark:via-blue-500/20 dark:to-pink-500/20 border border-white/20 dark:border-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Happy Clients', icon: User2 },
              { value: '10K+', label: 'Projects Delivered', icon: Shield },
              { value: '150+', label: 'Countries Served', icon: Globe },
              { value: '24/7', label: 'Support Available', icon: Headphones },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50">
                      <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
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

// Types for better TypeScript support
interface Service {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  darkColor: string;
  image: string;
  features: string[];
  stats: string;
}