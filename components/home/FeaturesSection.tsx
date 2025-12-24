import React from 'react';

export function FeaturesSection({ features }: { features: any[] }) {
  return (
    <section className="section-py-lg">
      <div className="container-width">
        <div className="text-center space-md mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4">Why Choose RadioWave?</h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Professional tools and features designed specifically for modern radio broadcasting
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="card-base card-padding-md relative overflow-hidden hover:border-gray-700 transition-all duration-200">
                <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-bl from-purple-600/10 to-transparent rounded-full blur-2xl" />
                <div className={`mb-3 md:mb-4 p-2 md:p-3 rounded-xl bg-gray-800/50 w-fit ${feature.color}`}>
                  {feature.icon}
                </div>
                <h4 className="mb-2 md:mb-3">{feature.title}</h4>
                <p className="text-muted-foreground text-small">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;