import AdminSidebar from '@/components/Admin/Sidebar'
import ProgressBar from '@/components/Admin/ProgressBar'
import { signOut } from '@/lib/actions/auth'
import { requireEditor } from '@/lib/utils/rbac'

/**
 * Admin Layout with Enterprise RBAC
 * Only accessible to users with 'editor' or 'admin' roles
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce role-based access control
  // This will automatically redirect unauthorized users
  const user = await requireEditor()
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProgressBar />
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-dark shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back! 👋
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {user.full_name || user.email}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-md border border-primary/20">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-primary capitalize">{user.role}</span>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-all duration-200"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
