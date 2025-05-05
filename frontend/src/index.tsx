import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Check if dark mode is preferred
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Add dark class to html element if dark mode is preferred
if (isDarkMode) {
  document.documentElement.classList.add('dark');
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
