import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  // Update session first
  const response = await updateSession(request)
  
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // If not authenticated, redirect to signin
    if (!user) {
      const redirectUrl = new URL('/signin', request.url)
      redirectUrl.searchParams.set('error', 'Please sign in to access this page')
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Check user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    // If not admin or editor, redirect to home with error
    if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('error', 'Unauthorized access')
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, and other static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
