import Link from 'next/link';
import { Play, Zap, TrendingUp, Shield, Globe, Sparkles, Calendar, Headphones, Mic, Users, Radio, Music, Award, Cloud, Satellite, AudioWaveform, Tv, Megaphone } from 'lucide-react';
import { heroMedia } from '@/lib/heroMedia';

export function Hero() {
  const selectedMedia = heroMedia[0];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 dark:from-gray-950 dark:via-[#0a1521] dark:to-gray-900">
      {/* Professional Background Layers */}
      <div className="absolute inset-0">
        {/* Base Gradient with primary color */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-[#0a1521] dark:via-[#0d1a2a] dark:to-[#111f30]" />
        
        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(210, 100%, 60%, 0.2) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, hsl(210, 100%, 70%, 0.2) 0%, transparent 50%)`,
            backgroundSize: '50% 50%'
          }}
        />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(210, 100%, 60%, 0.3) 1px, transparent 1px),
                                linear-gradient(to bottom, hsl(210, 100%, 60%, 0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
            }}
          />
        </div>

        {/* Floating Orbital Elements */}
        <div className="absolute top-20 left-10 w-96 h-96">
          <div 
            className="absolute inset-0 rounded-full animate-float"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(210, 100%, 60%, 0.2) 0%, transparent 70%)'
            }}
          />
          <div 
            className="absolute inset-0 rounded-full animate-float-slow"
            style={{
              background: 'radial-gradient(circle at 70% 70%, hsl(210, 100%, 70%, 0.1) 0%, transparent 70%)'
            }}
          />
        </div>

        <div className="absolute bottom-20 right-10 w-96 h-96">
          <div 
            className="absolute inset-0 rounded-full animate-float-slower"
            style={{
              background: 'radial-gradient(circle at 40% 40%, hsl(210, 100%, 80%, 0.3) 0%, transparent 70%)'
            }}
          />
        </div>

        {/* Signal Waves Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[1, 2, 3].map((wave) => (
            <div
              key={wave}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-600/30 dark:border-blue-400/20"
              style={{
                width: `${wave * 50}vw`,
                height: `${wave * 50}vw`,
                animation: `wave ${5 + wave * 3}s linear infinite`,
                animationDelay: `${wave * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Professional Media Background Images */}
        <div className="absolute inset-0">
          {/* Broadcasting Studio - Left */}
          <div 
            className="absolute top-20 left-10 w-[500px] h-[600px] opacity-10 dark:opacity-20"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1598387846347-8106adc49f4e?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'radial-gradient(circle at 30% 30%, black 40%, transparent 70%)',
              animation: 'float 12s ease-in-out infinite'
            }}
          />
          
          {/* Audio Control Room - Right */}
          <div 
            className="absolute bottom-20 right-10 w-[600px] h-[450px] opacity-5 dark:opacity-15"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'radial-gradient(circle at 70% 70%, black 30%, transparent 70%)',
              animation: 'float 14s ease-in-out infinite',
              animationDelay: '2s'
            }}
          />
          
          {/* Radio Equipment - Center */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-5 dark:opacity-10"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1596727741746-56d5a3947c7a?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'radial-gradient(circle at center, black 50%, transparent 90%)',
              animation: 'float 16s ease-in-out infinite',
              animationDelay: '1s'
            }}
          />
        </div>

        {/* Signal Dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-600/20 dark:bg-blue-400/10"
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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container-width px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="relative space-y-8">
              {/* Professional Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-gray-900/80 dark:to-gray-950/80 border-blue-600/50 dark:border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur bg-blue-600/30 dark:bg-blue-500/30" />
                    <Sparkles className="relative h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                    Enterprise Broadcast Platform
                  </span>
                </div>
                <div className="h-6 w-px bg-blue-600/50 dark:bg-blue-500/30" />
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-800/80 dark:text-blue-200/80">
                    Live 24/7
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  <span className="block text-gray-900 dark:text-gray-100">
                    Broadcast with
                  </span>
                  <span className="relative inline-block">
                    <span className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
                      Precision
                    </span>
                    <div className="absolute -bottom-3 left-0 w-full h-1 rounded-full transform scale-x-0 animate-grow bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300" />
                  </span>
                  <span className="block text-gray-900 dark:text-gray-100">
                    & Power
                  </span>
                </h1>

                <p className="text-xl max-w-2xl leading-relaxed font-light text-gray-700 dark:text-gray-300">
                  Studio-grade audio infrastructure, real-time analytics, and enterprise solutions 
                  for professional broadcasters and media organizations worldwide.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { 
                    icon: Shield, 
                    label: 'Secure Infrastructure', 
                    value: 'AES-256',
                    color: 'text-blue-600 dark:text-blue-400'
                  },
                  { 
                    icon: TrendingUp, 
                    label: 'Live Analytics', 
                    value: 'Real-time',
                    color: 'text-blue-500 dark:text-blue-300'
                  },
                  { 
                    icon: Globe, 
                    label: 'Global Reach', 
                    value: '99.99%',
                    color: 'text-blue-400 dark:text-blue-200'
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="group p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-gray-900/70 dark:to-gray-950/70 border-blue-600/40 dark:border-blue-500/20 hover:border-blue-600/60 dark:hover:border-blue-500/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl backdrop-blur-sm bg-gradient-to-br from-blue-600/30 to-blue-700/20 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-600/50 dark:border-blue-500/30 ${feature.color}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {feature.value}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                          {feature.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link
                  href="/booking"
                  className="group relative px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white"
                >
                  <span>Start Free Trial</span>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <div className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10 bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400" />
                </Link>

                <button
                  onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 text-blue-900 dark:text-blue-100 border border-blue-600/50 dark:border-blue-500/30"
                >
                  <Calendar className="h-6 w-6" />
                  <span>Book Services</span>
                </button>

                <Link
                  href="/demo"
                  className="group px-10 py-5 rounded-2xl backdrop-blur-xl border-2 font-bold text-lg transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 bg-blue-50/50 dark:bg-gray-900/50 border-blue-600/50 dark:border-blue-500/30 text-blue-900 dark:text-blue-100"
                >
                  <Play className="h-6 w-6 fill-current" />
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {[
                  { value: '500+', label: 'Professional Stations', icon: Radio },
                  { value: '10M+', label: 'Monthly Listeners', icon: Users },
                  { value: '150+', label: 'Countries Served', icon: Globe },
                  { value: '24/7', label: 'Expert Support', icon: Cloud },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Media Showcase */}
            <div className="relative">
              {/* Main Media Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-blue-600/40 dark:border-blue-500/20">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* Professional Studio Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-110"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80")'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 via-gray-50/40 to-transparent dark:from-gray-950/90 dark:via-gray-950/40 dark:to-transparent" />
                  
                  {/* Live Broadcast Indicator */}
                  <div className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 bg-gradient-to-br from-blue-600/80 to-blue-500/80 dark:from-blue-500/80 dark:to-blue-400/80">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur animate-ping bg-blue-500 dark:bg-blue-400" />
                      <div className="relative w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-white font-semibold text-sm">LIVE</span>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-sm bg-gradient-to-t from-gray-50/95 via-gray-50/60 to-transparent dark:from-gray-950/95 dark:via-gray-950/60 dark:to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                          Main Control Room
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Broadcasting across 5 continents
                        </p>
                      </div>
                      <div className="text-blue-900 dark:text-blue-100">
                        <Zap className="h-5 w-5 inline mr-2" />
                        <span className="text-sm">HD Audio 320kbps</span>
                      </div>
                    </div>
                    
                    {/* Audio Visualizer */}
                    <div className="mt-6 h-12 flex items-end justify-center gap-1">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-t bg-gradient-to-t from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300"
                          style={{
                            height: `${Math.random() * 40 + 8}px`,
                            animation: `spectrum ${0.5 + Math.random()}s ease-in-out infinite ${i * 0.02}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating Signal Elements */}
                <div className="absolute -top-4 -right-4 w-32 h-32 rounded-2xl rotate-12 backdrop-blur-xl border animate-float bg-gradient-to-br from-blue-600/20 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-400/5 border-blue-600/40 dark:border-blue-500/20" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-3xl -rotate-12 backdrop-blur-xl border animate-float-slower bg-gradient-to-br from-blue-100/30 to-blue-50/20 dark:from-gray-800/30 dark:to-gray-900/20 border-blue-600/40 dark:border-blue-500/20" />
              </div>

              {/* Services Mini Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: Headphones, 
                    label: 'Studio Setup', 
                    desc: 'Professional gear',
                    color: 'text-blue-600 dark:text-blue-400'
                  },
                  { 
                    icon: Mic, 
                    label: 'Voice Training', 
                    desc: 'Expert coaching',
                    color: 'text-blue-500 dark:text-blue-300'
                  },
                  { 
                    icon: Music, 
                    label: 'Audio Production', 
                    desc: 'Mastering & mixing',
                    color: 'text-blue-400 dark:text-blue-200'
                  },
                  { 
                    icon: AudioWaveform, 
                    label: 'Signal Processing', 
                    desc: 'Clean transmission',
                    color: 'text-blue-300 dark:text-blue-100'
                  },
                ].map((service, idx) => (
                  <div
                    key={idx}
                    onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group p-4 rounded-2xl backdrop-blur-xl border cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-xl bg-gradient-to-br from-blue-50/60 to-blue-100/60 dark:from-gray-900/60 dark:to-gray-950/60 border-blue-600/40 dark:border-blue-500/20 hover:border-blue-600/60 dark:hover:border-blue-500/40 hover:bg-gradient-to-br hover:from-blue-100/70 hover:to-blue-200/70 dark:hover:from-gray-800/70 dark:hover:to-gray-900/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl shadow-lg bg-gradient-to-br from-blue-600/40 to-blue-700/30 dark:from-blue-500/30 dark:to-blue-600/20 border border-blue-600/60 dark:border-blue-500/40 ${service.color}`}>
                        <service.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {service.label}
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-400">
                          {service.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking Callout */}
              <div className="mt-8 relative">
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-blue-100/90 dark:from-gray-800/90 dark:to-gray-900/90" />
                  <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-blue-600/40 to-blue-500/40 dark:from-blue-500/30 dark:to-blue-400/30" />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl backdrop-blur-sm bg-blue-600/30 dark:bg-blue-500/20 border border-blue-600/50 dark:border-blue-500/30">
                          <Calendar className="h-6 w-6 text-blue-900 dark:text-blue-100" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            Ready to Broadcast?
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Schedule your studio session today
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg bg-blue-600 dark:bg-blue-400 text-gray-100 dark:text-gray-900"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="animate-bounce flex flex-col items-center">
          <span className="text-sm mb-2 text-blue-600/60 dark:text-blue-400/60">
            Explore More
          </span>
          <div className="w-6 h-10 rounded-full flex justify-center border-2 border-blue-600/50 dark:border-blue-500/30">
            <div className="w-1 h-3 rounded-full mt-2 animate-scroll bg-blue-600 dark:bg-blue-400" />
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
        @keyframes wave {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        @keyframes spectrum {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        .animate-grow { animation: grow 1s ease-out forwards; animation-delay: 0.5s; }
        .animate-scroll { animation: scroll 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}