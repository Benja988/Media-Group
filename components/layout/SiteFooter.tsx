"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radio, Facebook, Twitter, Instagram, Linkedin, Youtube,
  Mail, Phone, MapPin, Globe, Headphones, Music,
  Shield, Award, Users, Clock, ChevronDown, ChevronUp,
  Wifi, Sparkles, Cloud, TrendingUp, Send, Heart
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function SiteFooter() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:bg-blue-400' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:bg-blue-700' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com', color: 'hover:bg-red-600' },
  ];

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/stations', label: 'Radio Stations' },
    { href: '/podcasts', label: 'Podcasts' },
    { href: '/news', label: 'Media News' },
    { href: '/schedule', label: 'Broadcast Schedule' },
    { href: '/team', label: 'Our Team' },
  ];

  const services = [
    { href: '/services/broadcasting', label: 'Professional Broadcasting', icon: Radio },
    { href: '/services/production', label: 'Audio Production', icon: Music },
    { href: '/services/streaming', label: 'Live Streaming', icon: Wifi },
    { href: '/services/marketing', label: 'Media Marketing', icon: TrendingUp },
    { href: '/services/training', label: 'Broadcast Training', icon: Users },
    { href: '/services/consulting', label: 'Media Consulting', icon: Award },
  ];

  const resources = [
    { href: '/blog', label: 'Media Blog' },
    { href: '/press', label: 'Press Releases' },
    { href: '/careers', label: 'Careers' },
    { href: '/partners', label: 'Partnerships' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support Center' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: Mail, text: 'info@tetemekomedia.com', href: 'mailto:info@tetemekomedia.com' },
    { icon: MapPin, text: 'Broadcast Center, Media District, Nairobi, Kenya', href: '#' },
    { icon: Clock, text: '24/7 Broadcasting & Support', href: '#' },
  ];

  const broadcastStats = [
    { value: '500+', label: 'Professional Stations', icon: Radio },
    { value: '24/7', label: 'Live Broadcasting', icon: Clock },
    { value: '10M+', label: 'Monthly Listeners', icon: Users },
    { value: '150+', label: 'Countries Reached', icon: Globe },
  ];

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-[#0a1521] dark:to-gray-900 border-t border-blue-200/30 dark:border-gray-800">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Signal Waves */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          {[1, 2, 3].map((wave) => (
            <div
              key={wave}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400"
              style={{
                width: `${wave * 100}%`,
                height: `${wave * 100}%`,
                animation: `wave ${6 + wave * 2}s linear infinite`,
                animationDelay: `${wave * 0.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Signal Dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/5 dark:bg-blue-400/3"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container-width relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Top Section - Brand & Newsletter */}
        <div className="py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Logo className="h-12 w-12 rounded-xl ring-2 ring-blue-200 dark:ring-gray-700" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 ring-2 ring-white dark:ring-gray-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-400 dark:to-blue-300">
                    Tetemeko Media Group
                  </h2>
                  <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                    Professional Broadcasting Worldwide
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                Leading media solutions provider with state-of-the-art broadcasting technology, 
                reaching millions worldwide with premium content and professional services.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Follow Us:</span>
                <div className="flex items-center gap-2">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:scale-110"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4 text-blue-700 dark:text-blue-300 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="lg:pl-8">
              <div className="rounded-2xl p-6 backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30">
                    <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Stay Updated
                    </h3>
                    <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                      Get broadcast insights & media trends
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 outline-none transition-all text-gray-900 dark:text-white placeholder-blue-700/50 dark:placeholder-blue-300/50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Subscribe to Newsletter</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                
                {isSubscribed && (
                  <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300 text-center">
                      Thank you for subscribing! Check your email for confirmation.
                    </p>
                  </div>
                )}
                
                <p className="mt-4 text-xs text-blue-700/60 dark:text-blue-300/60 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Broadcast Stats */}
        <div className="py-8 border-y border-blue-200/30 dark:border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {broadcastStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-blue-700/80 dark:text-blue-300/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Mobile Accordion Sections */}
            <div className="lg:hidden space-y-4">
              {/* Quick Links Accordion */}
              <div className="rounded-xl border border-blue-200/30 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('quicklinks')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white/50 dark:bg-gray-800/50"
                >
                  <span className="font-semibold text-blue-900 dark:text-blue-100">Quick Links</span>
                  {openSection === 'quicklinks' ? (
                    <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
                {openSection === 'quicklinks' && (
                  <div className="px-4 py-3 bg-white/30 dark:bg-gray-900/30">
                    <div className="space-y-2">
                      {quickLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className="block py-2 text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Services Accordion */}
              <div className="rounded-xl border border-blue-200/30 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('services')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white/50 dark:bg-gray-800/50"
                >
                  <span className="font-semibold text-blue-900 dark:text-blue-100">Our Services</span>
                  {openSection === 'services' ? (
                    <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
                {openSection === 'services' && (
                  <div className="px-4 py-3 bg-white/30 dark:bg-gray-900/30">
                    <div className="space-y-3">
                      {services.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={idx}
                            href={service.href}
                            className="flex items-center gap-3 py-2 text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span>{service.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Accordion */}
              <div className="rounded-xl border border-blue-200/30 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('resources')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white/50 dark:bg-gray-800/50"
                >
                  <span className="font-semibold text-blue-900 dark:text-blue-100">Resources</span>
                  {openSection === 'resources' ? (
                    <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
                {openSection === 'resources' && (
                  <div className="px-4 py-3 bg-white/30 dark:bg-gray-900/30">
                    <div className="space-y-2">
                      {resources.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          className="block py-2 text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="grid grid-cols-3 gap-8">
                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    Quick Links
                  </h3>
                  <div className="space-y-3">
                    {quickLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="block text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    Our Services
                  </h3>
                  <div className="space-y-3">
                    {services.map((service, idx) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={idx}
                          href={service.href}
                          className="flex items-center gap-3 text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span>{service.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    Resources
                  </h3>
                  <div className="space-y-3">
                    {resources.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="block text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info - Always visible */}
            <div className="lg:col-span-2 lg:pl-8">
              <div className="rounded-2xl p-6 backdrop-blur-sm border border-blue-200/30 dark:border-gray-800 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, idx) => {
                    const Icon = info.icon;
                    return (
                      <a
                        key={idx}
                        href={info.href}
                        className="flex items-start gap-3 group"
                      >
                        <div className="flex-shrink-0 p-2 rounded-lg bg-blue-50/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm text-blue-900 dark:text-blue-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {info.text}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
                
                {/* Live Broadcast Status */}
                <div className="mt-6 pt-6 border-t border-blue-200/30 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur bg-blue-600/30 animate-ping" />
                      <div className="relative h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Currently Broadcasting Live
                      </div>
                      <div className="text-xs text-blue-700/80 dark:text-blue-300/80">
                        24/7 Professional Radio & TV
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-blue-200/30 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                &copy; {currentYear} Tetemeko Media Group. All rights reserved.
              </p>
              <p className="text-xs text-blue-700/60 dark:text-blue-300/60 mt-1">
                Professional Broadcasting • Media Solutions • Global Reach
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-blue-800 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Accessibility
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-blue-700/80 dark:text-blue-300/80">
              <Heart className="h-3 w-3" />
              <span>Made with passion for broadcasting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes wave {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </footer>
  );
}