import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ 
  navigation, 
  currentPage, 
  setCurrentPage,
  isOpen,
  setIsOpen 
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50
        w-64 h-full bg-dark-100 border-r border-gray-800
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌳</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary-400">B-Tree DB</h2>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === index;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPage(index);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-400 border-r-2 border-primary-500' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-400' : ''}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center">
              <p>v1.0.0</p>
              <p className="mt-1">Powered by Spring Boot & React</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;