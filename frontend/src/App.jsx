import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  DatabaseIcon, 
  PlusCircleIcon, 
  SearchIcon, 
  TrashIcon, 
  PencilIcon,
  ChartBarIcon,
  TreeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import InsertRecord from './components/Records/InsertRecord';
import SearchRecord from './components/Records/SearchRecord';
import DeleteRecord from './components/Records/DeleteRecord';
import UpdateRecord from './components/Records/UpdateRecord';
import RangeQuery from './components/Records/RangeQuery';
import TreeVisualization from './components/Visualization/TreeVisualization';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, component: Dashboard },
  { name: 'Insert Record', icon: PlusCircleIcon, component: InsertRecord },
  { name: 'Search Record', icon: SearchIcon, component: SearchRecord },
  { name: 'Delete Record', icon: TrashIcon, component: DeleteRecord },
  { name: 'Update Record', icon: PencilIcon, component: UpdateRecord },
  { name: 'Range Query', icon: ChartBarIcon, component: RangeQuery },
  { name: 'Tree Visualization', icon: TreeIcon, component: TreeVisualization },
];

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { dbInfo, refreshInfo } = useDatabase();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    refreshInfo();
    const interval = setInterval(refreshInfo, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const CurrentComponent = navigation[currentPage].component;

  return (
    <Layout
      navigation={navigation}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      dbInfo={dbInfo}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <CurrentComponent />
    </Layout>
  );
};

function App() {
  return (
    <DatabaseProvider>
      <div className="min-h-screen bg-dark-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e2936',
              color: '#e2e8f0',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1e2936',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1e2936',
              },
            },
          }}
        />
        <AppContent />
      </div>
    </DatabaseProvider>
  );
}

export default App;