import React, { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to console with browser info for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear storage:', e);
      alert('Failed to clear storage. Please try manually clearing your browser cache.');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground mb-4">
                  The application encountered an error and couldn't continue. This might be due to a
                  temporary issue or corrupted data in your browser.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h2 className="text-sm font-semibold text-foreground mb-2">Error Details:</h2>
                <p className="text-sm text-muted-foreground font-mono break-words">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReload}
                className="flex-1 gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              <Button
                onClick={this.handleClearStorage}
                variant="outline"
                className="flex-1 gap-2"
                size="lg"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cache & Reload
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Browser:</strong> {navigator.userAgent}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Time:</strong> {new Date().toISOString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
