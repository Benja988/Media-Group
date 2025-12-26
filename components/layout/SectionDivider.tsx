import { Sparkles } from 'lucide-react';

export function SectionDivider() {
  return (
    <div className="relative py-8 md:py-12">
      {/* Main Line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      
      {/* Animated Center Element */}
      <div className="relative flex justify-center">
        <div className="group relative">
          {/* Outer Ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Center Circle */}
          <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          
          {/* Glowing Dots */}
          <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-blue-500 animate-ping" />
          <div className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-pink-500 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 animate-float" />
      </div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}