import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CheckAuthPage() {
  const supabase = await createClient()
  
  // Get auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Not Authenticated</h1>
          <p className="mb-4">You are not signed in.</p>
          <a href="/signin" className="text-blue-600 hover:underline">Go to Sign In</a>
        </div>
      </div>
    )
  }
  
  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Authentication Status
        </h1>
        
        {/* Auth User Info */}
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
            ✅ Authenticated User
          </h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({
              id: user.id,
              email: user.email,
              created_at: user.created_at,
            }, null, 2)}
          </pre>
        </div>
        
        {/* Profile Info */}
        {profileError ? (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
              ❌ Profile Error
            </h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profileError, null, 2)}
            </pre>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Issue:</strong> Your profile doesn&apos;t exist in the database. 
                This means the profile wasn&apos;t created when you signed up.
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-2">
                <strong>Solution:</strong> Run this SQL in Supabase:
              </p>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
{`INSERT INTO profiles (id, email, role, full_name)
VALUES ('${user.id}', '${user.email}', 'admin', '${user.email?.split('@')[0]}')
ON CONFLICT (id) DO UPDATE SET role = 'admin';`}
              </pre>
            </div>
          </div>
        ) : profile ? (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
              👤 Profile Data
            </h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
            {profile.role === 'admin' || profile.role === 'editor' ? (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ You have <strong>{profile.role}</strong> role. You should be able to access /admin
                </p>
                <a href="/admin" className="mt-2 inline-block text-blue-600 hover:underline">
                  Try accessing /admin →
                </a>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Your role is <strong>{profile.role}</strong>. You need &apos;admin&apos; or &apos;editor&apos; role.
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-2">
                  Run this SQL in Supabase to make yourself admin:
                </p>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
{`UPDATE profiles SET role = 'admin' WHERE id = '${user.id}';`}
                </pre>
              </div>
            )}
          </div>
        ) : null}
        
        <div className="flex gap-4">
          <a 
            href="/signin" 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Sign In Page
          </a>
          <a 
            href="/admin" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Admin Panel
          </a>
        </div>
      </div>
    </div>
  )
}
