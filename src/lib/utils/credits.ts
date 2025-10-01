import { createClient } from '@/utils/supabase/server'

/**
 * Credit Management Utilities
 * Enterprise-grade AI credit system
 */

export interface CreditBalance {
  balance: number
  totalEarned: number
  totalUsed: number
  lastRefillAt: Date
}

export interface CreditTransaction {
  id: string
  amount: number
  balanceAfter: number
  transactionType: string
  description: string
  createdAt: Date
}

/**
 * Get user's credit balance
 */
export async function getUserCredits(userId: string): Promise<CreditBalance | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_credits')
    .select('balance, total_earned, total_used, last_refill_at')
    .eq('user_id', userId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return {
    balance: data.balance,
    totalEarned: data.total_earned,
    totalUsed: data.total_used,
    lastRefillAt: new Date(data.last_refill_at),
  }
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
  const credits = await getUserCredits(userId)
  return credits ? credits.balance >= amount : false
}

/**
 * Deduct credits from user balance
 * Uses database function for atomic transaction
 */
export async function deductCredits(
  userId: string,
  amount: number,
  transactionType: string,
  description?: string,
  referenceId?: string,
  referenceType?: string
): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_transaction_type: transactionType,
    p_description: description || null,
    p_reference_id: referenceId || null,
    p_reference_type: referenceType || null,
  })
  
  if (error) {
    return false
  }
  
  return data === true
}

/**
 * Add credits to user balance
 * Uses database function for atomic transaction
 */
export async function addCredits(
  userId: string,
  amount: number,
  transactionType: string,
  description?: string
): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_transaction_type: transactionType,
    p_description: description || null,
  })
  
  if (error) {
    return false
  }
  
  return data === true
}

/**
 * Get user's credit transaction history
 */
export async function getCreditTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('id, amount, balance_after, transaction_type, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error || !data) {
    return []
  }
  
  return data.map(tx => ({
    id: tx.id,
    amount: tx.amount,
    balanceAfter: tx.balance_after,
    transactionType: tx.transaction_type,
    description: tx.description || '',
    createdAt: new Date(tx.created_at),
  }))
}

/**
 * Log AI usage with credit deduction
 */
export async function logAIUsage(
  userId: string,
  serviceType: string,
  creditsUsed: number,
  modelUsed: string,
  metadata?: {
    inputTokens?: number
    outputTokens?: number
    requestMetadata?: any
    responseMetadata?: any
    durationMs?: number
  }
): Promise<boolean> {
  const supabase = await createClient()
  
  // First, deduct credits
  const deducted = await deductCredits(
    userId,
    creditsUsed,
    'ai_generation',
    `${serviceType} - ${modelUsed}`
  )
  
  if (!deducted) {
    return false
  }
  
  // Then log the usage
  const { error } = await supabase
    .from('ai_usage_logs')
    .insert({
      user_id: userId,
      service_type: serviceType,
      credits_used: creditsUsed,
      model_used: modelUsed,
      input_tokens: metadata?.inputTokens,
      output_tokens: metadata?.outputTokens,
      request_metadata: metadata?.requestMetadata || {},
      response_metadata: metadata?.responseMetadata || {},
      duration_ms: metadata?.durationMs,
      success: true,
    })
  
  if (error) {
    // Silently fail - logging should not break the main flow
  }
  
  return true
}

/**
 * Get AI usage statistics for a user
 */
export async function getAIUsageStats(userId: string, days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('ai_usage_logs')
    .select('service_type, credits_used, created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
  
  if (error || !data) {
    return {
      totalCreditsUsed: 0,
      usageByService: {},
      dailyUsage: [],
    }
  }
  
  // Calculate statistics
  const totalCreditsUsed = data.reduce((sum, log) => sum + log.credits_used, 0)
  
  const usageByService = data.reduce((acc, log) => {
    acc[log.service_type] = (acc[log.service_type] || 0) + log.credits_used
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalCreditsUsed,
    usageByService,
    dailyUsage: data,
  }
}

/**
 * Refill monthly credits based on subscription
 */
export async function refillMonthlyCredits(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Get user's subscription
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('plan_id, subscription_plans(ai_credits_monthly)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  
  if (!subscription || !subscription.subscription_plans) {
    return false
  }
  
  const monthlyCredits = (subscription.subscription_plans as any).ai_credits_monthly
  
  if (monthlyCredits <= 0) {
    return false
  }
  
  // Add monthly credits
  return await addCredits(
    userId,
    monthlyCredits,
    'subscription_refill',
    'Monthly subscription credit refill'
  )
}

/**
 * Check if user needs credit refill
 */
export async function checkAndRefillCredits(userId: string): Promise<boolean> {
  const credits = await getUserCredits(userId)
  
  if (!credits) {
    return false
  }
  
  const now = new Date()
  const lastRefill = credits.lastRefillAt
  const daysSinceRefill = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60 * 24))
  
  // Refill if more than 30 days since last refill
  if (daysSinceRefill >= 30) {
    return await refillMonthlyCredits(userId)
  }
  
  return false
}

/**
 * Credit cost constants for different AI services
 */
export const CREDIT_COSTS = {
  // RAG Chatbot
  RAG_QUERY_SMALL: 1,      // Simple query
  RAG_QUERY_MEDIUM: 2,     // Medium complexity
  RAG_QUERY_LARGE: 5,      // Complex query with large context
  
  // Image Generation
  IMAGE_GENERATION_SD: 10,     // Stable Diffusion
  IMAGE_GENERATION_DALLE: 20,  // DALL-E
  IMAGE_UPSCALE: 5,            // Image upscaling
  
  // YouTube Automation
  YOUTUBE_SCRIPT: 10,          // Script generation
  YOUTUBE_VOICE: 15,           // Voice synthesis
  YOUTUBE_VIDEO: 50,           // Full video generation
  
  // Document Processing
  DOCUMENT_UPLOAD: 2,          // Per document
  DOCUMENT_CHUNK: 1,           // Per 1000 tokens
  EMBEDDING_GENERATION: 1,     // Per 1000 tokens
  
  // API Calls
  API_CALL_BASIC: 1,           // Basic API call
  API_CALL_ADVANCED: 5,        // Advanced API call
} as const

/**
 * Calculate credit cost for a service
 */
export function calculateCreditCost(
  serviceType: string,
  complexity: 'small' | 'medium' | 'large' = 'medium'
): number {
  const key = `${serviceType.toUpperCase()}_${complexity.toUpperCase()}` as keyof typeof CREDIT_COSTS
  return CREDIT_COSTS[key] || CREDIT_COSTS.API_CALL_BASIC
}
