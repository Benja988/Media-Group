import { Sparkles, Radio, Satellite, AudioWaveform, Signal } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SectionDivider() {
  const icons = [Radio, Satellite, AudioWaveform, Signal];
  const [currentIcon, setCurrentIcon] = useState(0);

  // Rotate icons every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="relative py-8 md:py-8 lg:py-10 overflow-hidden">
      {/* Background Signal Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2, 3].map((wave) => (
          <div
            key={wave}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10 dark:border-blue-500/5"
            style={{
              width: `${wave * 100}%`,
              height: `${wave * 100}%`,
              animation: `wave ${4 + wave * 2}s linear infinite`,
              animationDelay: `${wave * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Main Line with Gradient */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px">
        <div className="relative h-full overflow-hidden">
          {/* Base Line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/50 dark:via-blue-800/30 to-transparent" />
          
          {/* Animated Line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/40 dark:via-blue-400/30 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {/* Center Element */}
      <div className="relative flex justify-center">
        <div className="group relative">
          {/* Outer Glow Rings */}
          <div className="absolute -inset-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-blue-400/20 to-blue-300/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-blue-400/10 blur-lg opacity-30" />
          </div>
          
          {/* Pulsing Ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-blue-400/30 dark:border-blue-500/20 animate-ping-slow" />
          
          {/* Main Container */}
          <div className="relative z-10">
            <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl backdrop-blur-xl border-2 shadow-2xl bg-gradient-to-br from-blue-50/90 via-white to-blue-100/90 dark:from-gray-900/90 dark:via-[#0a1521] dark:to-gray-950/90 border-blue-500/30 dark:border-blue-500/50 group-hover:border-blue-500/50 dark:group-hover:border-blue-400/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-blue-500/20">
              
              {/* Animated Gradient Border */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500 blur" />
              
              {/* Icon with Gradient */}
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <CurrentIcon className="relative h-7 w-7 md:h-8 md:w-8 text-blue-600 dark:text-blue-400 transition-all duration-500 group-hover:scale-110" />
              </div>
              
              {/* Sparkles Overlay */}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-4 w-4 text-blue-400 dark:text-blue-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Signal Dots */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 animate-float-slow"
                style={{
                  left: `${(dot - 2) * 8}px`,
                  animationDelay: `${dot * 0.3}s`
                }}
              />
            ))}
          </div>
          
          {/* Bottom Signal Dots */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-300 animate-float"
                style={{
                  left: `${(dot - 2) * 8}px`,
                  animationDelay: `${dot * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating Elements with Signal Theme */}
      <div className="absolute top-1/2 left-[15%] -translate-y-1/2">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-400/10 animate-float-slower" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-blue-400/5 animate-float" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
        </div>
      </div>
      
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 to-blue-300/10 animate-float" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/5 to-blue-300/5 animate-float-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-300/50" />
        </div>
      </div>
      
      {/* Corner Elements */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 opacity-20">
        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
      </div>
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-20">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes wave {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 5s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 2s ease-out infinite; }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}