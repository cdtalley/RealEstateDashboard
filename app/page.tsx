'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

