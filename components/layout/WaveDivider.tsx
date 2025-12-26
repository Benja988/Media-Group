export function WaveDivider() {
  return (
    <div className="relative py-8 md:py-12 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl">
          {/* Wave Pattern */}
          <svg 
            className="w-full h-8 text-gray-200 dark:text-gray-800"
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              fill="currentColor"
            />
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,119.13-4.36,50-14.19,92.47-52.9,116.48-100.3V0Z" 
              opacity=".5" 
              fill="currentColor"
            />
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      
      {/* Animated Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-blue-500/20 animate-ping" />
      </div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-purple-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}