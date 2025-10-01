import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'

export default async function DebugAuthPage() {
  const supabase = await createClient()
  
  // Check current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  // Check if profiles table exists and get profile
  let profile = null
  let profileError = null
  
  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = data
    profileError = error
  }
  
  // Test database connection
  const { data: testData, error: testError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔍 Authentication Debug Page
        </h1>
        
        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Environment Variables
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:</strong>{' '}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div>
                <strong>SUPABASE_SERVICE_ROLE_KEY:</strong>{' '}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Current User */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current User
            </h2>
            {userError ? (
              <div className="text-red-600 dark:text-red-400">
                <strong>Error:</strong> {userError.message}
              </div>
            ) : user ? (
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Email Confirmed:</strong> {user.email_confirmed_at ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Created:</strong> {user.created_at}</div>
                <div><strong>Last Sign In:</strong> {user.last_sign_in_at}</div>
                <div><strong>User Metadata:</strong></div>
                <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(user.user_metadata, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400">
                No user logged in
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Profile
            </h2>
            {profileError ? (
              <div className="text-red-600 dark:text-red-400">
                <strong>Error:</strong> {profileError.message}
                {profileError.code === 'PGRST116' && (
                  <div className="mt-2 text-sm">
                    This usually means the profiles table doesn&apos;t exist or the user doesn&apos;t have a profile yet.
                  </div>
                )}
              </div>
            ) : profile ? (
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {profile.id}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Full Name:</strong> {profile.full_name || 'Not set'}</div>
                <div><strong>Company:</strong> {profile.company || 'Not set'}</div>
                <div><strong>Role:</strong> {profile.role}</div>
                <div><strong>Created:</strong> {profile.created_at}</div>
              </div>
            ) : user ? (
              <div className="text-yellow-600 dark:text-yellow-400">
                User is logged in but no profile found in database
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400">
                No user logged in
              </div>
            )}
          </div>

          {/* Database Connection Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Database Connection Test
            </h2>
            {testError ? (
              <div className="text-red-600 dark:text-red-400">
                <strong>Error:</strong> {testError.message}
                <div className="mt-2 text-sm">
                  {testError.code === '42P01' && 'Table "profiles" does not exist. You need to run the database schema.'}
                  {testError.code === '42501' && 'Permission denied. Check your RLS policies.'}
                </div>
              </div>
            ) : (
              <div className="text-green-600 dark:text-green-400">
                ✅ Database connection successful
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <div>
                <a
                  href="/signup"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
                >
                  Go to Sign Up
                </a>
                <a
                  href="/signin"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
                >
                  Go to Sign In
                </a>
                <a
                  href="/admin"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Go to Admin
                </a>
              </div>
              
              {user && (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
