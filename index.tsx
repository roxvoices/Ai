// IMPORTANT USER INSTRUCTION: If you encounter an error like "Could not find the 'screenshot_path' column of 'payment_requests' in the schema cache"
// when submitting payment proofs, please ensure you have manually added a 'screenshot_path' column of type 'TEXT'
// to your 'payment_requests' table in your Supabase database. This column is required by the backend.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Uncommented to render your main App component

// Global error handler for uncaught exceptions
window.onerror = (message, source, lineno, colno, error) => {
  console.error("UNCAUGHT JAVASCRIPT ERROR (Global Handler):", { message, source, lineno, colno, error });
  // You could also display a user-friendly modal here instead of just logging
  // For debugging purposes, logging is sufficient initially.
  // Returning true prevents the default browser error handling (e.g., console log to console, but still logs to global handler)
  return false; 
};

// Global error handler for unhandled promise rejections
window.onunhandledrejection = (event) => {
  console.error("UNHANDLED PROMISE REJECTION (Global Handler):", { reason: event.reason, promise: event.promise });
  // Prevent default handling
  event.preventDefault();
  return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App /> {/* Reverted to rendering the App component */}
  </React.StrictMode>
);