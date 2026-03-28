"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type SaveStatus = "saved" | "saving" | "error" | "idle";

interface UseAutoSaveOptions {
  debounceMs?: number;
  onSave: (data: unknown) => Promise<void>;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * useAutoSave Hook
 *
 * Automatically saves data with debouncing and conflict detection.
 * Shows save status for UI indicators.
 *
 * @example
 * const { status, save, retry } = useAutoSave({
 *   onSave: async (data) => {
 *     await fetch(`/api/resumes/${resumeId}`, {
 *       method: 'PUT',
 *       body: JSON.stringify(data),
 *     });
 *   },
 * });
 *
 * // Trigger save on data change
 * useEffect(() => { save(resumeData); }, [resumeData]);
 *
 * // Display status
 * <SaveIndicator status={status} />
 */
export function useAutoSave<T>({
  debounceMs = 1200,
  onSave,
  onError,
  enabled = true,
}: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const pendingRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const pendingDataRef = useRef<T | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
      }
    };
  }, []);

  const save = useCallback(
    (data: T) => {
      if (!enabled) return;

      const serialized = JSON.stringify(data);

      // Skip if no changes
      if (serialized === lastSavedDataRef.current) {
        return;
      }

      // Store pending data
      pendingDataRef.current = data;

      // Update status to saving
      setStatus("saving");
      setError(null);

      // Clear existing timeout
      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
      }

      // Debounced save
      pendingRef.current = setTimeout(async () => {
        try {
          await onSave(data);
          lastSavedDataRef.current = serialized;
          setStatus("saved");
          setLastSaved(new Date());
          pendingDataRef.current = null;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setStatus("error");
          setError(error);
          onError?.(error);
        }
      }, debounceMs);
    },
    [enabled, debounceMs, onSave, onError]
  );

  const retry = useCallback(async () => {
    if (!pendingDataRef.current) return;

    setStatus("saving");
    setError(null);

    try {
      await onSave(pendingDataRef.current);
      lastSavedDataRef.current = JSON.stringify(pendingDataRef.current);
      setStatus("saved");
      setLastSaved(new Date());
      pendingDataRef.current = null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setStatus("error");
      setError(error);
      onError?.(error);
    }
  }, [onSave, onError]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    lastSavedDataRef.current = "";
    pendingDataRef.current = null;
    if (pendingRef.current) {
      clearTimeout(pendingRef.current);
    }
  }, []);

  return {
    status,
    lastSaved,
    error,
    save,
    retry,
    reset,
    isSaving: status === "saving",
    isSaved: status === "saved",
    hasError: status === "error",
  };
}

/**
 * Save Status Indicator Component
 */
interface SaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date | null;
  onRetry?: () => void;
  className?: string;
}

export function formatLastSaved(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default useAutoSave;
