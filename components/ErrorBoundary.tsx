'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-red-500 max-w-2xl">
            <h2 className="text-red-400 text-xl font-bold mb-4">Something went wrong</h2>
            <p className="text-slate-300 mb-2">Error: {this.state.error?.message}</p>
            <pre className="text-slate-400 text-sm overflow-auto bg-slate-900 p-4 rounded mt-4">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

