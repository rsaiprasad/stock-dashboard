import React from 'react';
import DataSyncPage from './pages/DataSync';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Dashboard</h1>
        </div>
      </header>

      <main>
        <DataSyncPage />
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-400">
          <p>Stock Dashboard &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
