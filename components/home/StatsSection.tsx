import React from 'react';

export function StatsSection({ stats }: { stats: any[] }) {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gray-800/50">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
            <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change} this month
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
