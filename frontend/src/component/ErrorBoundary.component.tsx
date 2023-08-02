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
  private static LogErrorToMyService(
    error: Error,
    componentStack: string | null,
  ): void {
    // eslint-disable-next-line no-console
    console.error("Error occurred:", error);
    // eslint-disable-next-line no-console
    console.error("Component stack:", componentStack);
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    ErrorBoundary.LogErrorToMyService(error, info.componentStack);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
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

    return children;
  }
}

export default ErrorBoundary;
