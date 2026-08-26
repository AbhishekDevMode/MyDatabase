import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, change, trend, loading }) => {
  const colorMap = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    red: 'border-red-500',
  };

  const textColorMap = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
  };

  return (
    <div className={`stat-card border-l-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10 ${textColorMap[color]}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;