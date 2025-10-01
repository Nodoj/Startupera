import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth Callback Route
 * Handles authentication callbacks from Supabase (email verification, password reset, etc.)
 * Supports both code exchange and direct token methods
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  
  // Get all possible parameters
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/reset-password'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors from Supabase
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  const supabase = await createClient()

  // Method 1: Handle token_hash (used for email verification and password reset)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (verifyError) {
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=${encodeURIComponent(verifyError.message)}`
      )
    }

    // Successful authentication - redirect to the next page
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // Method 2: Handle code (PKCE flow)
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // Successful authentication - redirect to the next page
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // No valid token provided
  return NextResponse.redirect(
    `${requestUrl.origin}/signin?error=${encodeURIComponent('Invalid or missing authentication token')}`
  )
}
