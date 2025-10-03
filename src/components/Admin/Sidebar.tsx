'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminTheme } from '@/styles/admin-theme'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  MessageSquare,
  Workflow
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Flows', href: '/admin/flows', icon: Workflow },
  { name: 'Demo Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Contact Submissions', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-gray-dark shadow-sm border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <div className="ml-3">
              <span className="block text-base font-bold text-gray-900 dark:text-white">
                TORA<span className="text-primary">FLOW</span>
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className={`h-4 w-4 mr-3 ${
                  isActive ? '' : 'text-gray-500 dark:text-gray-400'
                }`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              v1.0.0
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
