import React, { useState } from 'react';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { databaseAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useDatabase } from '../../context/DatabaseContext';

const DeleteRecord = () => {
  const { refreshInfo } = useDatabase();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setShowConfirm(false);
    setLoading(true);
    setResult(null);

    try {
      const response = await databaseAPI.delete(parseInt(key));
      
      if (response.success) {
        toast.success(`Record deleted successfully! Key: ${key}`);
        setResult({ key: parseInt(key), message: response.message });
        setKey('');
        refreshInfo();
      } else {
        toast.error(response.message || 'Failed to delete record');
      }
    } catch (error) {
      toast.error('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key) {
      toast.error('Please enter a key to delete');
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/20 rounded-lg">
          <TrashIcon className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Delete Record</h2>
          <p className="text-gray-400">Remove a record by its key</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="btn-danger px-6 flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <TrashIcon className="h-5 w-5" />
                )}
                Delete
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
            <p className="text-sm text-green-400 font-medium">Record Deleted Successfully</p>
            <p className="mt-1 text-sm text-gray-300">Key: {result.key}</p>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-dark-100 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the record with key <strong className="text-white">{key}</strong>?
                This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteRecord;