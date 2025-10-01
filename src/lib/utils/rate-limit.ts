/**
 * Rate Limiting Utility
 * 
 * This module provides rate limiting functionality to prevent brute force attacks
 * and abuse. It uses an in-memory store for development and can be upgraded to
 * Redis/Upstash for production.
 * 
 * For production, install: npm install @upstash/ratelimit @upstash/redis
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

// In-memory store (use Redis/Upstash in production)
const store: RateLimitStore = {}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  // Authentication endpoints
  signin: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  signup: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // API endpoints
  api: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // Contact form
  contact: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
}

/**
 * Check rate limit for a given identifier
 * 
 * @param identifier - Unique identifier (e.g., IP address, user ID, email)
 * @param limit - Maximum number of attempts
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const key = identifier
  
  // Get or create entry
  if (!store[key] || store[key].resetAt < now) {
    store[key] = {
      count: 0,
      resetAt: now + windowMs,
    }
  }
  
  const entry = store[key]
  entry.count++
  
  const success = entry.count <= limit
  const remaining = Math.max(0, limit - entry.count)
  const reset = entry.resetAt
  
  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Rate limit for sign in attempts
 */
export async function rateLimitSignIn(identifier: string): Promise<RateLimitResult> {
  const { maxAttempts, windowMs } = RATE_LIMITS.signin
  return checkRateLimit(`signin:${identifier}`, maxAttempts, windowMs)
}

/**
 * Rate limit for sign up attempts
 */
export async function rateLimitSignUp(identifier: string): Promise<RateLimitResult> {
  const { maxAttempts, windowMs } = RATE_LIMITS.signup
  return checkRateLimit(`signup:${identifier}`, maxAttempts, windowMs)
}

/**
 * Rate limit for password reset attempts
 */
export async function rateLimitPasswordReset(identifier: string): Promise<RateLimitResult> {
  const { maxAttempts, windowMs } = RATE_LIMITS.passwordReset
  return checkRateLimit(`password-reset:${identifier}`, maxAttempts, windowMs)
}

/**
 * Rate limit for API calls
 */
export async function rateLimitAPI(identifier: string): Promise<RateLimitResult> {
  const { maxAttempts, windowMs } = RATE_LIMITS.api
  return checkRateLimit(`api:${identifier}`, maxAttempts, windowMs)
}

/**
 * Rate limit for contact form submissions
 */
export async function rateLimitContact(identifier: string): Promise<RateLimitResult> {
  const { maxAttempts, windowMs } = RATE_LIMITS.contact
  return checkRateLimit(`contact:${identifier}`, maxAttempts, windowMs)
}

/**
 * Reset rate limit for a given identifier
 * Useful for admin actions or after successful authentication
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  delete store[identifier]
}

/**
 * Get rate limit status without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
  limit: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const entry = store[identifier]
  
  if (!entry || entry.resetAt < now) {
    return {
      success: true,
      limit,
      remaining: limit,
      reset: now,
    }
  }
  
  const remaining = Math.max(0, limit - entry.count)
  
  return {
    success: entry.count < limit,
    limit,
    remaining,
    reset: entry.resetAt,
  }
}

/**
 * Format rate limit error message
 */
export function formatRateLimitError(result: RateLimitResult): string {
  const resetDate = new Date(result.reset)
  const minutesUntilReset = Math.ceil((result.reset - Date.now()) / 60000)
  
  return `Too many attempts. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`
}
