"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{
    error: Error | null;
    onReset: () => void;
  }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * <ErrorBoundary>
 *   <ResumeBuilder />
 * </ErrorBoundary>
 *
 * Or with custom fallback:
 * <ErrorBoundary fallback={CustomErrorComponent}>
 *   <AIOptimizer />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Capture to Sentry (if available)
    this.captureToSentry(error, errorInfo);
  }

  private async captureToSentry(error: Error, errorInfo: ErrorInfo) {
    try {
      const Sentry = await import("@sentry/nextjs").catch(() => null);
      if (Sentry?.captureException) {
        Sentry.captureException(error, {
          extra: { componentStack: errorInfo.componentStack },
        });
      }
    } catch {
      // Sentry not available
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback ?? DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
interface DefaultErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-8"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-white">
        Something went wrong
      </h2>

      <p className="mb-6 max-w-md text-center text-sm text-zinc-400">
        We encountered an unexpected error. Don&apos;t worry, your data is safe.
        Try refreshing the page or contact support if the problem persists.
      </p>

      {process.env.NODE_ENV === "development" && error && (
        <details className="mb-6 w-full max-w-lg rounded-lg bg-black/40 p-4">
          <summary className="cursor-pointer text-sm font-medium text-zinc-300">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 overflow-x-auto text-xs text-red-300">
            {error.message}
            {error.stack && (
              <>
                {"\n\n"}
                {error.stack.split("\n").slice(1, 6).join("\n")}
              </>
            )}
          </pre>
        </details>
      )}

      <div className="flex gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2"
          aria-label="Try again to recover from error"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="gap-2"
          aria-label="Reload the page"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Reload Page
        </Button>

        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600"
          aria-label="Go to dashboard"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go to Dashboard
        </Button>
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        If this keeps happening,{" "}
        <a
          href="mailto:support@resumate.ai"
          className="text-purple-400 underline hover:text-purple-300"
        >
          contact support
        </a>
      </p>
    </div>
  );
}

/**
 * Minimal Error Fallback (for smaller components)
 */
export function MinimalErrorFallback({
  error,
  onReset,
}: DefaultErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-4"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <span className="text-sm text-zinc-300">
          {error?.message || "Something went wrong"}
        </span>
      </div>
      <Button onClick={onReset} variant="ghost" size="sm">
        Retry
      </Button>
    </div>
  );
}

export default ErrorBoundary;
