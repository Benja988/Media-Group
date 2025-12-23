import React from 'react';

export function FeaturesSection({ features }: { features: any[] }) {
  return (
    <section className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose RadioWave?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Professional tools and features designed specifically for modern radio broadcasting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02]">
              <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-bl from-purple-600/10 to-transparent rounded-full blur-2xl" />
              <div className={`mb-4 p-3 rounded-xl bg-gray-800/50 w-fit ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
