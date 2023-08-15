import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App'; // Corrected path

if (chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get(() => {
    const root = document.querySelector('#root');
    if (root) {
      createRoot(root).render(<App />);
    } else {
      console.error("Root element not found");
    }
  });
} else {
  console.error("Chrome storage API is not available");
}
