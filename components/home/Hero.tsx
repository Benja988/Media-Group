import Link from 'next/link';
import { Play, Zap, TrendingUp, Shield, Globe, Sparkles, Calendar, Headphones, Mic, Users } from 'lucide-react';
import { heroMedia } from '@/lib/heroMedia';

export function Hero() {
  const selectedMedia = heroMedia[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950/50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float-slower" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      </div>

      <div className="section-py-xl relative z-10">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="relative space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    Next-Gen Radio Platform
                  </span>
                </div>
                <div className="h-4 w-px bg-purple-300 dark:bg-purple-700" />
                <span className="text-xs text-purple-600 dark:text-purple-400">v2.0 Launched</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="block text-gray-900 dark:text-white">
                    Elevate Your
                  </span>
                  <span className="relative inline-block">
                    <span className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                      Broadcast
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                  </span>
                  <span className="block text-gray-900 dark:text-white">
                    Experience
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  Studio-grade audio, AI-powered analytics, and seamless content management 
                  for forward-thinking media groups and independent broadcasters.
                </p>
              </div>

              {/* Feature Pillars */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: 'Enterprise Security', value: 'AES-256' },
                  { icon: TrendingUp, label: 'Real-time Analytics', value: 'Live Data' },
                  { icon: Globe, label: 'Global CDN', value: '99.9% Uptime' },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="group p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40">
                        <feature.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {feature.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {feature.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons with Booking */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/booking"
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <span>Start Free Trial</span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                </Link>

                {/* Book Services Button - Primary Action */}
                <button
                  onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Services</span>
                </button>

                <Link
                  href="/demo"
                  className="group px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 text-gray-900 dark:text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Play className="h-5 w-5 fill-current" />
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Quick Booking Preview */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Popular Services
                  </h3>
                  <span className="text-sm text-purple-600 dark:text-purple-400">Starting at $49/mo</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Headphones, label: 'Studio Setup', color: 'from-blue-500 to-cyan-500' },
                    { icon: Mic, label: 'Voice Training', color: 'from-pink-500 to-rose-500' },
                    { icon: Users, label: 'Team Onboarding', color: 'from-purple-500 to-indigo-500' },
                    { icon: Zap, label: 'AI Mixing', color: 'from-amber-500 to-orange-500' },
                  ].map((service, idx) => (
                    <button
                      key={idx}
                      onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="group p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gradient-to-br hover:from-white hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${service.color}`}>
                          <service.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                          {service.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                {[
                  { value: '500+', label: 'Active Stations' },
                  { value: '10M+', label: 'Monthly Listeners' },
                  { value: '150+', label: 'Countries' },
                  { value: '24/7', label: 'Live Support' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Media Card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                {/* Media Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950">
                  {selectedMedia.type === 'image' ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${selectedMedia.src})` }}
                    />
                  ) : (
                    <video
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={selectedMedia.src} type="video/mp4" />
                    </video>
                  )}
                  
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Control Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white font-medium">Live Broadcast</span>
                      </div>
                      <div className="text-white/80 text-sm">
                        <Zap className="h-4 w-4 inline mr-2" />
                        128kbps HQ Audio
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl rotate-12 backdrop-blur-sm border border-white/10" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-3xl -rotate-12 backdrop-blur-sm border border-white/10" />
              </div>

              {/* Booking Callout Card */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 max-w-md">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-xl p-5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Ready to Broadcast?</h4>
                        <p className="text-white/80 text-xs">Book a studio session today</p>
                      </div>
                    </div>
                    <button
                      onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-gray-100 font-semibold text-sm transition-all duration-300 hover:scale-105"
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

      {/* Booking Section - Integrated below hero */}
      {/* <div id="booking-section" className="relative z-20">
        <div className="container-width">
          <div className="relative -mt-8">
            <BookingSection />
          </div>
        </div>
      </div> */}

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
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 10s ease-in-out infinite; }
      `}</style>
    </section>
  );
}