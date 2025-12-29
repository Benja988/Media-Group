// components/stations/StationHero.tsx

import { Radio, Tv, Sparkles } from 'lucide-react';

export function StationHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-800 dark:via-blue-800 dark:to-cyan-800 text-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute top-60 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
                <div className="absolute -bottom-40 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slower" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
            </div>

            <div className="relative z-10 py-20 md:py-28">
                <div className="container-width">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span className="text-sm font-medium">Live Broadcasting Network</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="block mb-2">Discover</span>
                            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                                Amazing Stations
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                            Tune into the best radio and TV stations from around the world.
                            Crystal-clear audio, live streaming, and endless entertainment.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
                                <div className="text-sm text-white/80">Active Stations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-1">50+</div>
                                <div className="text-sm text-white/80">Countries</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
                                <div className="text-sm text-white/80">Live Streaming</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-1">HD</div>
                                <div className="text-sm text-white/80">Quality Audio</div>
                            </div>
                        </div>

                        {/* Type Icons */}
                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <Radio className="h-8 w-8 text-yellow-300" />
                                </div>
                                <span className="text-sm font-medium">Radio Stations</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <Tv className="h-8 w-8 text-pink-300" />
                                </div>
                                <span className="text-sm font-medium">TV Channels</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Separator */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 120" className="w-full h-12 fill-white dark:fill-gray-900">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"/>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"/>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"/>
                </svg>
            </div>
        </section>
    );
}