import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-dom-container">
          <div className="error-status">500</div>
          <div className="error-ooops">Ooops!!</div>
          <div className="error-message mb-3">
            An error occurred on this page.
          </div>
          <a href="/" className="btn btn-primary">
            Go Back to Home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

function logErrorToMyService(error: Error, componentStack: string | null): void {
  console.error('Error occurred:', error);
  console.error('Component stack:', componentStack);
}

export default ErrorBoundary;
