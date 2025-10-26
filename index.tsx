
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/video.ts';

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

// Register the service worker after the page has fully loaded.
// This is the most reliable way to avoid the "invalid state" error.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Construct an absolute URL for the service worker to prevent cross-origin errors.
    const swUrl = `${location.origin}/service-worker.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}