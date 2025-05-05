import React from 'react';

import { SyncStatus } from '../types/stock';

interface SyncStatusCardProps {
  status: SyncStatus;
  onRefresh: () => void;
}

const SyncStatusCard: React.FC<SyncStatusCardProps> = ({ status, onRefresh }) => {
  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'failed':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'syncing':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'syncing':
        return (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`border-l-4 p-4 rounded-md shadow-sm ${getStatusColor()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">
            Sync Status: {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </h3>
          <div className="mt-2 text-sm">
            <p>{status.message}</p>
            {status.lastSync && (
              <p className="mt-1 text-xs opacity-75">
                Last sync: {new Date(status.lastSync).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            disabled={status.status === 'syncing'}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncStatusCard;
