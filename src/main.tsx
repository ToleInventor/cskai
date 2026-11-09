
import './App.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import Navigation from './part/Navigation';
import './index.css'

export const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://192.168.1.104:5000'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>
);