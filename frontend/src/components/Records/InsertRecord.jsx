import React, { useState } from 'react';
import { PlusCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { databaseAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useDatabase } from '../../context/DatabaseContext';

const InsertRecord = () => {
  const { refreshInfo } = useDatabase();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!key || !value) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await databaseAPI.insert(parseInt(key), value);
      
      if (response.success) {
        toast.success(`Record inserted successfully! Key: ${key}`);
        setResult(response.data);
        setKey('');
        setValue('');
        refreshInfo();
      } else {
        toast.error(response.message || 'Failed to insert record');
      }
    } catch (error) {
      toast.error('Failed to insert record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <PlusCircleIcon className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Insert Record</h2>
          <p className="text-gray-400">Add a new key-value pair to the database</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="input-field"
              placeholder="Enter integer key"
              min="0"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Value <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-field"
              placeholder="Enter value"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Inserting...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5" />
                Insert Record
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
            <p className="text-sm text-green-400 font-medium">Record Inserted Successfully</p>
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

export default InsertRecord;