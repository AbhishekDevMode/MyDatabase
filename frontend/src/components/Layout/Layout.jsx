import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ 
  children, 
  navigation, 
  currentPage, 
  setCurrentPage,
  dbInfo,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  return (
    <div className="flex h-screen bg-dark-300">
      <Sidebar
        navigation={navigation}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          dbInfo={dbInfo}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;