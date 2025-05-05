import React, { useState, useEffect } from 'react';
import DataSyncForm from '../components/DataSyncForm';
import SyncStatusCard from '../components/SyncStatusCard';
import { SyncStatus } from '../types/stock';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';

interface StockSyncData {
  type: 'stock';
  data: {
    symbol: string;
    timeframe: string;
    startDate: string;
    endDate?: string;
  };
}

interface OptionSyncData {
  type: 'options';
  data: {
    symbol: string;
    expirationDate?: string;
    strikePrice?: number;
    optionType?: 'call' | 'put';
  };
}

const API_URL = process.env.API_URL || 'http://localhost:3000';

const DataSyncPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    status: 'idle',
    message: 'No sync has been performed yet',
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/data-sync/sync-status`);
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const handleSubmit = async (data: StockSyncData | OptionSyncData) => {
    setIsLoading(true);
    setNotification(null);

    try {
      const endpoint = data.type === 'stock' ? 'stock' : 'options';
      const response = await fetch(`${API_URL}/data-sync/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await response.json();

      setNotification({
        type: 'success',
        message: `Successfully synced ${data.type} data for ${data.data.symbol}`,
      });

      // Refresh sync status
      fetchSyncStatus();
    } catch (error) {
      console.error('Error syncing data:', error);
      setNotification({
        type: 'error',
        message: `Failed to sync data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setIsLoading(true);
    setNotification(null);

    try {
      const response = await fetch(`${API_URL}/data-sync/sync-all`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setNotification({
        type: 'success',
        message: 'Full data sync initiated successfully',
      });

      // Refresh sync status
      fetchSyncStatus();
    } catch (error) {
      console.error('Error initiating full sync:', error);
      setNotification({
        type: 'error',
        message: `Failed to initiate full sync: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Data Synchronization
      </h1>

      {notification && (
        <Alert
          className={`mb-6 ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <DataSyncForm onSubmit={handleSubmit} isLoading={isLoading} />

          <div className="mt-6">
            <button
              onClick={handleSyncAll}
              disabled={isLoading}
              className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing All Data...
                </span>
              ) : (
                'Sync All Configured Symbols'
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sync Status</h2>
            <SyncStatusCard status={syncStatus} onRefresh={fetchSyncStatus} />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                About Data Synchronization
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This tool allows you to sync stock and options data from Alpaca API to your local
                database. You can sync data for specific symbols, timeframes, and date ranges.
              </p>
              <h4 className="text-md font-semibold mb-1 text-gray-900 dark:text-white">
                Available Timeframes:
              </h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                <li>1 Minute (1Min)</li>
                <li>5 Minutes (5Min)</li>
                <li>15 Minutes (15Min)</li>
                <li>1 Hour (1Hour)</li>
                <li>1 Day (1Day)</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> Syncing large date ranges or multiple symbols may take some
                time. The status will be updated once the sync is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSyncPage;
