import React, { createContext, useState, useContext, useCallback } from 'react';
import { databaseAPI } from '../services/api';
import toast from 'react-hot-toast';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [dbInfo, setDbInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await databaseAPI.getInfo();
      if (response.success) {
        setDbInfo(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch database info');
      console.error('Error fetching database info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    dbInfo,
    loading,
    error,
    refreshInfo,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};