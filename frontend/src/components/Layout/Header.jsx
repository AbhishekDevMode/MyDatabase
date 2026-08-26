import React from 'react';
import { Bars3Icon, BellIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useDatabase } from '../../context/DatabaseContext';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { dbInfo, refreshInfo, loading } = useDatabase();

  return (
    <header className="bg-dark-100 border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-primary-400">
            🌳 B-Tree Database
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {dbInfo && (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Records:</span>
                <span className="font-semibold text-primary-400">
                  {dbInfo.size || 0}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Height:</span>
                <span className="font-semibold text-green-400">
                  {dbInfo.height || 0}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Order:</span>
                <span className="font-semibold text-yellow-400">
                  {dbInfo.order || 4}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={refreshInfo}
            disabled={loading}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;