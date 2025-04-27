import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './css/style.css';
import './css/satoshi.css';
import './css/custom.css';
import Dashboard from './Dashboard';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <Router>
        <Dashboard />
      </Router>
  </React.StrictMode>,
);
