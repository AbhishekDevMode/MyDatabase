import React, { useState, useEffect } from 'react';
import { TreeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { databaseAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TreeVisualization = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTree = async () => {
    setLoading(true);
    try {
      const response = await databaseAPI.visualize();
      if (response.success) {
        setTreeData(response.data);
        toast.success('Tree loaded successfully');
      } else {
        toast.error(response.message || 'Failed to load tree');
      }
    } catch (error) {
      toast.error('Failed to load tree visualization');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

  const renderTreeNodes = (nodes) => {
    if (!nodes || nodes.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">Tree is empty</p>
        </div>
      );
    }

    const maxLevel = Math.max(...nodes.map(n => n.level));
    const levels = Array.from({ length: maxLevel + 1 }, (_, i) => 
      nodes.filter(n => n.level === i)
    );

    return (
      <div className="space-y-6">
        {levels.map((levelNodes, levelIndex) => (
          <div key={levelIndex} className="animate-fade-in" style={{ animationDelay: `${levelIndex * 100}ms` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">
                Level {levelIndex}
              </span>
              <span className="text-xs text-gray-500">
                {levelNodes.length} node{levelNodes.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {levelNodes.map((node, index) => (
                <div
                  key={index}
                  className={`
                    relative p-3 rounded-lg border min-w-[100px] text-center
                    transition-all duration-200 hover:scale-105
                    ${node.isLeaf 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-blue-500/10 border-blue-500/30'
                    }
                  `}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    Node {node.nodeId}
                  </div>
                  <div className="font-mono text-sm text-white">
                    [{node.keys.join(', ')}]
                  </div>
                  {node.isLeaf && (
                    <span className="absolute -top-2 -right-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">
                      leaf
                    </span>
                  )}
                  {node.valueCount > 0 && (
                    <span className="absolute -bottom-2 -left-2 text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                      {node.valueCount} values
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <TreeIcon className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Tree Visualization</h2>
            <p className="text-gray-400">Visual representation of your B-Tree structure</p>
          </div>
        </div>
        <button
          onClick={loadTree}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          renderTreeNodes(treeData)
        )}
      </div>
    </div>
  );
};

export default TreeVisualization;