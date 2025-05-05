import React, { useState } from 'react';
import { TimeframeEnum } from '../types/stock';

interface DataSyncFormProps {
  onSubmit: (data: StockSyncData | OptionSyncData) => void;
  isLoading: boolean;
}

interface StockSyncData {
  type: 'stock';
  data: {
    symbol: string;
    timeframe: TimeframeEnum;
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

const DataSyncForm: React.FC<DataSyncFormProps> = ({ onSubmit, isLoading }) => {
  const [dataType, setDataType] = useState<'stock' | 'options'>('stock');
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState<TimeframeEnum>(TimeframeEnum['1Day']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [optionType, setOptionType] = useState<'call' | 'put' | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (dataType === 'stock') {
      onSubmit({
        type: 'stock',
        data: {
          symbol,
          timeframe,
          startDate,
          endDate: endDate || undefined,
        },
      });
    } else {
      onSubmit({
        type: 'options',
        data: {
          symbol,
          expirationDate: expirationDate || undefined,
          strikePrice: strikePrice ? parseFloat(strikePrice) : undefined,
          optionType: optionType || undefined,
        },
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sync Market Data</h2>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              dataType === 'stock'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setDataType('stock')}
          >
            Stock Data
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              dataType === 'options'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setDataType('options')}
          >
            Options Data
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="symbol"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Symbol
          </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="AAPL"
            required
          />
        </div>

        {dataType === 'stock' ? (
          <>
            <div className="mb-4">
              <label
                htmlFor="timeframe"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Timeframe
              </label>
              <select
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as TimeframeEnum)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={TimeframeEnum['1Min']}>1 Minute</option>
                <option value={TimeframeEnum['5Min']}>5 Minutes</option>
                <option value={TimeframeEnum['15Min']}>15 Minutes</option>
                <option value={TimeframeEnum['1Hour']}>1 Hour</option>
                <option value={TimeframeEnum['1Day']}>1 Day</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="expirationDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                id="expirationDate"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="strikePrice"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Strike Price (Optional)
              </label>
              <input
                type="number"
                id="strikePrice"
                value={strikePrice}
                onChange={(e) => setStrikePrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="150.00"
                step="0.01"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="optionType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Option Type (Optional)
              </label>
              <select
                id="optionType"
                value={optionType}
                onChange={(e) => setOptionType(e.target.value as 'call' | 'put' | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Option Type</option>
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataSyncForm;
