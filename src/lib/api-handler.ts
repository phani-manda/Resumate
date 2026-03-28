/**
 * API Error Handler - Resumate
 * Centralized error handling for all API routes
 *
 * Usage: export const POST = withErrorHandling(async (req, ctx) => { ... })
 */

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

// Types
type RouteContext = {
  params?: Promise<Record<string, string>>;
};

type RouteHandler = (
  req: NextRequest,
  ctx: RouteContext
) => Promise<NextResponse | Response>;

// Error response helper
function errorResponse(
  message: string,
  status: number,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// Sentry error capture (optional - gracefully handle if not installed)
async function captureException(error: Error, extra?: Record<string, unknown>) {
  try {
    // Dynamic import to avoid build errors if Sentry isn't installed
    const Sentry = await import("@sentry/nextjs").catch(() => null);
    if (Sentry?.captureException) {
      Sentry.captureException(error, { extra });
    }
  } catch {
    // Sentry not available - log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Capture]", error, extra);
    }
  }
}

/**
 * Wraps an API route handler with comprehensive error handling
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ctx: RouteContext) => {
    const startTime = Date.now();

    try {
      const response = await handler(req, ctx);

      // Log successful requests in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[API] ${req.method} ${req.nextUrl.pathname} - ${response.status} (${Date.now() - startTime}ms)`
        );
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaErrors: Record<string, { message: string; status: number }> = {
          P2002: { message: "A record with this value already exists", status: 409 },
          P2025: { message: "Record not found", status: 404 },
          P2003: { message: "Foreign key constraint failed", status: 400 },
          P2014: { message: "Required relation not found", status: 400 },
        };

        const errorInfo = prismaErrors[error.code];
        if (errorInfo) {
          console.error(`[Prisma Error] ${error.code}:`, error.message);
          return errorResponse(errorInfo.message, errorInfo.status);
        }
      }

      // Zod validation errors
      if (error instanceof ZodError) {
        console.error("[Validation Error]", error.flatten());
        return errorResponse("Validation failed", 400, {
          fieldErrors: error.flatten().fieldErrors,
          formErrors: error.flatten().formErrors,
        });
      }

      // Rate limit errors (custom)
      if (error instanceof Error && error.message.includes("rate limit")) {
        return errorResponse("Rate limit exceeded. Please try again later.", 429, {
          retryAfter: 60,
        });
      }

      // Authentication errors
      if (error instanceof Error && error.message.includes("unauthorized")) {
        return errorResponse("Authentication required", 401);
      }

      // AI/External service errors
      if (error instanceof Error && error.message.includes("AI provider")) {
        await captureException(error, {
          route: req.nextUrl.pathname,
          method: req.method,
        });
        return errorResponse(
          "AI service temporarily unavailable. Please try again.",
          503
        );
      }

      // Generic error handling
      const err = error instanceof Error ? error : new Error(String(error));

      // Capture to Sentry
      await captureException(err, {
        route: req.nextUrl.pathname,
        method: req.method,
        duration,
      });

      // Log error
      console.error(`[API Error] ${req.method} ${req.nextUrl.pathname}:`, err);

      // Return generic error in production, detailed in development
      if (process.env.NODE_ENV === "development") {
        return errorResponse("Internal server error", 500, {
          message: err.message,
          stack: err.stack?.split("\n").slice(0, 5),
        });
      }

      return errorResponse("Internal server error", 500);
    }
  };
}

/**
 * Rate limiting wrapper using Upstash (if available)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; reset: number }> {
  try {
    // Try to import Upstash rate limiter
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = Redis.fromEnv();
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
      analytics: true,
    });

    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // Rate limiting not available - allow all requests
    console.warn("[Rate Limit] Upstash not configured, skipping rate limit");
    return { success: true, remaining: limit, reset: Date.now() + windowMs };
  }
}

/**
 * Validates request body against a Zod schema
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: ZodError } }
): Promise<T> {
  const body = await req.json().catch(() => null);

  if (!body) {
    throw new Error("Invalid JSON body");
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw result.error;
  }

  return result.data as T;
}

/**
 * Extracts and validates route parameters
 */
export async function getRouteParams(
  ctx: RouteContext
): Promise<Record<string, string>> {
  if (!ctx.params) {
    return {};
  }
  return await ctx.params;
}
