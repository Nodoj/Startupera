import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Audit Event Interface
 */
interface AuditEvent {
  action: string
  userId?: string
  email?: string
  ipAddress?: string
  userAgent?: string
  resourceType?: string
  resourceId?: string
  error?: string
  metadata?: Record<string, any>
  severity?: 'info' | 'warning' | 'error' | 'critical'
}

/**
 * Log an audit event to the database
 * This function is used for security monitoring and compliance
 */
export async function logAuditEvent(
  supabase: SupabaseClient,
  event: AuditEvent
): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: event.userId || null,
        action: event.action,
        resource_type: event.resourceType || 'auth',
        resource_id: event.resourceId || null,
        ip_address: event.ipAddress || null,
        user_agent: event.userAgent || null,
        metadata: {
          email: event.email,
          error: event.error,
          ...event.metadata,
        },
        severity: event.severity || (event.error ? 'warning' : 'info'),
      })

    if (error) {
      // Silently fail if audit logging fails (don't throw to avoid breaking auth flow)
    }
  } catch (error) {
    // Silently fail - audit logging should never break the main flow
  }
}

/**
 * Log failed login attempt
 */
export async function logFailedLoginAttempt(
  supabase: SupabaseClient,
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<void> {
  try {
    await supabase
      .from('failed_login_attempts')
      .insert({
        email,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
  } catch (error) {
    // Silently fail
  }
}

/**
 * Check if account should be locked due to too many failed attempts
 */
export async function checkAccountLockout(
  supabase: SupabaseClient,
  email: string,
  ipAddress: string
): Promise<boolean> {
  try {
    // Check failed attempts in last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    
    const { count, error } = await supabase
      .from('failed_login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .eq('ip_address', ipAddress)
      .gte('attempted_at', fifteenMinutesAgo)

    if (error) {
      return false
    }

    // Lock account if more than 5 failed attempts
    return (count || 0) >= 5
  } catch (error) {
    return false
  }
}
