import Link from 'next/link';
import { ChevronRight, Play, Zap } from 'lucide-react';

export function Hero() {
  return (
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
  );
}

export default Hero;
