import React from 'react';

export function AppPage({ children, className = '' }) {
  return (
    <div className={`app-page ${className}`.trim()}>
      {children}
    </div>
  );
}
