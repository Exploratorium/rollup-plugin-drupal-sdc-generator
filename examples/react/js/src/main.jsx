import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

let container;
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'development') {
  container = document.getElementById('root');
} else {
  container = document.querySelector('div[data-component-id$=":my-component"]');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
