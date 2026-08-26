import React, { useState, useEffect } from 'react';
import {
  DatabaseIcon,
  TreeIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import RecentRecords from './RecentRecords';
import { useDatabase } from '../../context/DatabaseContext';

const Dashboard = () => {
  const { dbInfo, loading } = useDatabase();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    treeHeight: 0,
    treeOrder: 4,
    memoryUsage: '0 MB',
    operations: {
      inserts: 0,
      searches: 0,
      deletes: 0,
      updates: 0,
    }
  });

  useEffect(() => {
    if (dbInfo) {
      setStats(prev => ({
        ...prev,
        totalRecords: dbInfo.size || 0,
        treeHeight: dbInfo.height || 0,
        treeOrder: dbInfo.order || 4,
      }));
    }
  }, [dbInfo]);

  const statCards = [
    {
      title: 'Total Records',
      value: stats.totalRecords,
      icon: DatabaseIcon,
      color: 'blue',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Tree Height',
      value: stats.treeHeight,
      icon: TreeIcon,
      color: 'green',
      change: 'Optimal',
      trend: 'up',
    },
    {
      title: 'Tree Order',
      value: stats.treeOrder,
      icon: ChartBarIcon,
      color: 'yellow',
      change: 'Balanced',
      trend: 'up',
    },
    {
      title: 'Memory Usage',
      value: stats.memoryUsage,
      icon: ClockIcon,
      color: 'purple',
      change: '+2.4%',
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Overview of your B-Tree database</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatsCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {/* Recent Records */}
      <RecentRecords records={records} loading={loading} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary text-sm">Insert Record</button>
            <button className="btn-secondary text-sm">Search Record</button>
            <button className="btn-secondary text-sm">View Tree</button>
            <button className="btn-secondary text-sm">Export Data</button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Database Status</span>
              <span className="text-sm text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Cache Hit Rate</span>
              <span className="text-sm text-blue-400">87.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Storage Usage</span>
              <span className="text-sm text-yellow-400">64 MB / 200 MB</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '32%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;