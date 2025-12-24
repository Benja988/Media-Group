import React from 'react';

export function StatsSection({ stats }: { stats: any[] }) {
  return (
    <section className="section-py-lg bg-muted/30">
      <div className="container-width">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card-base card-padding-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="p-2.5 md:p-3 rounded-lg bg-gray-800/50">{stat.icon}</div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold mb-0.5">{stat.value}</div>
                  <div className="text-muted-foreground text-xs md:text-small">{stat.label}</div>
                </div>
              </div>
              <div className={`text-xs md:text-small ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change} this month
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;