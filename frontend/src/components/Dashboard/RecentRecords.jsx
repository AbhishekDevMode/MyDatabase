import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const RecentRecords = ({ records, loading }) => {
  // Sample data if no records
  const sampleRecords = [
    { key: 42, value: 'Hello World', timestamp: Date.now() - 60000 },
    { key: 100, value: 'B-Tree Database', timestamp: Date.now() - 120000 },
    { key: 75, value: 'Spring Boot Backend', timestamp: Date.now() - 180000 },
    { key: 200, value: 'React Frontend', timestamp: Date.now() - 240000 },
  ];

  const displayRecords = records.length > 0 ? records : sampleRecords;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Records</h3>
        <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All →
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-700 rounded" />
                <div className="h-3 w-24 bg-gray-700 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {displayRecords.map((record, index) => (
            <div key={index} className="py-3 flex items-center justify-between hover:bg-gray-800/50 px-3 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-mono text-sm">
                  {record.key}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{record.value}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                #{record.key}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRecords;