import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// Check if Upstash credentials are configured
const isUpstashConfigured = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN

// Create Redis client if configured
const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

// Rate limit configurations for different endpoints
export const rateLimiters = {
  // AI endpoints: 10 requests per minute
  ai: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        analytics: true,
        prefix: 'ratelimit:ai',
      })
    : null,

  // Chat endpoint: 20 requests per minute
  chat: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
        prefix: 'ratelimit:chat',
      })
    : null,

  // Upload endpoint: 5 requests per minute
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
        prefix: 'ratelimit:upload',
      })
    : null,

  // General API: 100 requests per minute
  general: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:general',
      })
    : null,

  // Strict limit for expensive operations: 3 per minute
  strict: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(3, '1 m'),
        analytics: true,
        prefix: 'ratelimit:strict',
      })
    : null,
}

export type RateLimitType = keyof typeof rateLimiters

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for a given identifier and limit type
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'general'
): Promise<RateLimitResult> {
  const limiter = rateLimiters[type]
  
  // If Upstash is not configured, allow all requests
  if (!limiter) {
    return {
      success: true,
      limit: 100,
      remaining: 100,
      reset: Date.now() + 60000,
    }
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier)
  
  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Get client identifier from request (IP or user ID)
 */
export function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }
  
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`
  }
  
  if (realIp) {
    return `ip:${realIp}`
  }
  
  // Fallback to a generic identifier
  return 'ip:unknown'
}

/**
 * Create rate limit error response with proper headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  )
}

/**
 * Middleware helper to apply rate limiting in API routes
 */
export async function withRateLimit(
  request: NextRequest,
  type: RateLimitType = 'general',
  userId?: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const identifier = getClientIdentifier(request, userId)
  const result = await checkRateLimit(identifier, type)
  
  if (!result.success) {
    return {
      allowed: false,
      response: createRateLimitResponse(result),
    }
  }
  
  return { allowed: true }
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 */
export function rateLimited<T>(
  handler: (request: NextRequest, context?: T) => Promise<NextResponse>,
  type: RateLimitType = 'general'
) {
  return async (request: NextRequest, context?: T): Promise<NextResponse> => {
    const { allowed, response } = await withRateLimit(request, type)
    
    if (!allowed && response) {
      return response
    }
    
    return handler(request, context)
  }
}
