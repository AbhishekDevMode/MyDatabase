import React, { useState } from 'react';
import { SearchIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { databaseAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SearchRecord = () => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!key) {
      toast.error('Please enter a key to search');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await databaseAPI.search(parseInt(key));
      
      if (response.success) {
        setResult(response.data);
        toast.success('Record found!');
      } else {
        setError(response.message || 'Record not found');
        toast.error('Record not found');
      }
    } catch (error) {
      setError('Failed to search record');
      toast.error('Failed to search record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/20 rounded-lg">
          <SearchIcon className="h-8 w-8 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Search Record</h2>
          <p className="text-gray-400">Find a record by its key</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="input-field flex-1"
                placeholder="Enter integer key"
                min="0"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                )}
                Search
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
            <p className="text-sm text-green-400 font-medium">Record Found</p>
            <div className="mt-2 text-sm text-gray-300 space-y-1">
              <p><span className="text-gray-500">Key:</span> {result.key}</p>
              <p><span className="text-gray-500">Value:</span> {result.value}</p>
              {result.timestamp && (
                <p><span className="text-gray-500">Timestamp:</span> {new Date(result.timestamp).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRecord;