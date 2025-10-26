
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Since this is a module script that runs after the document is parsed,
// we can attempt to register the service worker directly.
// This avoids timing issues related to the 'load' event that can cause
// an "invalid state" error in some environments.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${window.location.origin}/service-worker.js`)
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
