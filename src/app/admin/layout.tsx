import AdminSidebar from '@/components/Admin/Sidebar'
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
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              TORAFLOW Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
