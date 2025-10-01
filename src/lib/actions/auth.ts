'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { signInSchema, signUpSchema } from '@/lib/validation/auth.schemas'
import { ZodError } from 'zod'
import { logAuditEvent, logFailedLoginAttempt, checkAccountLockout } from '@/lib/utils/audit'
import { rateLimitSignIn, rateLimitSignUp, formatRateLimitError } from '@/lib/utils/rate-limit'

/**
 * Sign In Action with Enterprise Security
 * - Input validation with Zod
 * - Audit logging
 * - Failed attempt tracking
 * - Session management
 */
export async function signIn(formData: FormData) {
  try {
    // Extract and validate input
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      keepSignedIn: formData.get('keepSignedIn') === 'true',
    }

    // Validate with Zod schema
    const validatedData = signInSchema.parse(rawData)
    
    // Get request metadata for audit logging
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    
    // Rate limiting check
    const rateLimitResult = await rateLimitSignIn(ipAddress)
    if (!rateLimitResult.success) {
      const errorMsg = formatRateLimitError(rateLimitResult)
      redirect(`/signin?error=${encodeURIComponent(errorMsg)}`)
    }
    
    // Create client with session persistence based on checkbox
    const supabase = await createClient(validatedData.keepSignedIn)

    // Attempt sign in
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      // Log failed attempt
      await logAuditEvent(supabase, {
        action: 'failed_signin',
        email: validatedData.email,
        ipAddress,
        userAgent,
        error: error.message,
      })
      
      redirect(`/signin?error=${encodeURIComponent(error.message)}`)
    }

    // Log successful signin
    if (authData.user) {
      await logAuditEvent(supabase, {
        action: 'signin',
        userId: authData.user.id,
        email: validatedData.email,
        ipAddress,
        userAgent,
      })
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
    
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      redirect(`/signin?error=${encodeURIComponent(firstError.message)}`)
    }
    throw error
  }
}

/**
 * Sign Up Action with Enterprise Security
 * - Input validation with Zod
 * - Password strength requirements
 * - Audit logging
 * - Automatic profile creation
 */
export async function signUp(formData: FormData) {
  try {
    // Extract and validate input
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName'),
      company: formData.get('company') || undefined,
    }

    // Validate with Zod schema
    const validatedData = signUpSchema.parse(rawData)
    
    // Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    
    // Rate limiting check
    const rateLimitResult = await rateLimitSignUp(ipAddress)
    if (!rateLimitResult.success) {
      const errorMsg = formatRateLimitError(rateLimitResult)
      redirect(`/signup?error=${encodeURIComponent(errorMsg)}`)
    }
    
    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          company: validatedData.company,
        }
      }
    })

    if (error) {
      // Log failed signup
      await logAuditEvent(supabase, {
        action: 'failed_signup',
        email: validatedData.email,
        ipAddress,
        userAgent,
        error: error.message,
      })
      
      redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    // Log successful signup
    if (authData.user) {
      await logAuditEvent(supabase, {
        action: 'signup',
        userId: authData.user.id,
        email: validatedData.email,
        ipAddress,
        userAgent,
      })
    }
    
    revalidatePath('/', 'layout')
    redirect('/signin?message=Check your email to confirm your account')
    
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      redirect(`/signup?error=${encodeURIComponent(firstError.message)}`)
    }
    throw error
  }
}

/**
 * Sign Out Action with Audit Logging
 */
export async function signOut() {
  const supabase = await createClient()
  
  // Get user before signing out
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get request metadata
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'
  
  // Log signout
  if (user) {
    await logAuditEvent(supabase, {
      action: 'signout',
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
    })
  }
  
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/signin')
}

export async function createProfile(userId: string, email: string, fullName?: string, company?: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      full_name: fullName,
      company,
      role: 'user'
    })

  if (error) {
    console.error('Error creating profile:', error)
  }
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }

  return profile
}

/**
 * Request Password Reset
 * Sends password reset email to user
 */
export async function requestPasswordReset(formData: FormData) {
  try {
    const email = formData.get('email') as string
    
    // Validate email
    const { emailSchema } = await import('@/lib/validation/auth.schemas')
    const validatedEmail = emailSchema.parse(email)
    
    // Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    
    // Rate limiting check
    const { rateLimitPasswordReset, formatRateLimitError } = await import('@/lib/utils/rate-limit')
    const rateLimitResult = await rateLimitPasswordReset(ipAddress)
    if (!rateLimitResult.success) {
      const errorMsg = formatRateLimitError(rateLimitResult)
      redirect(`/forgot-password?error=${encodeURIComponent(errorMsg)}`)
    }
    
    const supabase = await createClient()
    
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
    })
    
    if (error) {
      redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
    }
    
    // Log password reset request
    await logAuditEvent(supabase, {
      action: 'password_reset_request',
      email: validatedEmail,
      ipAddress,
      userAgent: headersList.get('user-agent') || 'unknown',
    })
    
    // Always show success message (don't reveal if email exists)
    redirect('/forgot-password?message=If an account exists with that email, you will receive a password reset link.')
    
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      redirect(`/forgot-password?error=${encodeURIComponent(firstError.message)}`)
    }
    throw error
  }
}

/**
 * Reset Password with Token
 * Updates user password after email verification
 * Note: This should be called from a page that handles the auth callback
 */
export async function resetPassword(formData: FormData) {
  try {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    // Validate passwords
    const { passwordResetSchema } = await import('@/lib/validation/auth.schemas')
    const validatedData = passwordResetSchema.parse({ password, confirmPassword })
    
    const supabase = await createClient()
    
    // First, verify we have a valid session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      redirect(`/reset-password?error=${encodeURIComponent('Invalid or expired reset link. Please request a new password reset.')}`)
    }
    
    // Update password
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    })
    
    if (error) {
      redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
    }
    
    // Log password reset
    const headersList = await headers()
    await logAuditEvent(supabase, {
      action: 'password_reset_complete',
      userId: user.id,
      email: user.email,
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
      userAgent: headersList.get('user-agent') || 'unknown',
    })
    
    redirect('/signin?message=Password reset successful. Please sign in with your new password.')
    
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      redirect(`/reset-password?error=${encodeURIComponent(firstError.message)}`)
    }
    throw error
  }
}
