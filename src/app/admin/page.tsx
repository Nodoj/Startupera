import { createClient } from '@/utils/supabase/server'
import { adminTheme } from '@/styles/admin-theme'
import { BarChart3, Users, FileText, Calendar, TrendingUp, Eye } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get dashboard statistics
  const [
    { count: flowsCount },
    { count: demoBookingsCount },
    { count: contactSubmissionsCount },
    { data: recentFlows },
    { data: recentBookings }
  ] = await Promise.all([
    supabase.from('flows').select('*', { count: 'exact', head: true }),
    supabase.from('demo_bookings').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('flows').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('demo_bookings').select('id, name, company, booking_date, status').order('created_at', { ascending: false }).limit(5)
  ])

  const stats = [
    {
      title: 'Total Flows',
      value: flowsCount || 0,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      change: '+12%',
      changeColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Demo Bookings',
      value: demoBookingsCount || 0,
      icon: Calendar,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      change: '+8%',
      changeColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Contact Submissions',
      value: contactSubmissionsCount || 0,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      change: '+23%',
      changeColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Total Views',
      value: '2,847',
      icon: Eye,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      change: '+15%',
      changeColor: 'text-orange-600 dark:text-orange-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={adminTheme.typography.h1}>
            Dashboard Overview
          </h1>
          <p className={`${adminTheme.typography.body} mt-1`}>
            Here&apos;s what&apos;s happening with your AI automation platform.
          </p>
        </div>
        
        {/* Quick Actions Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/admin/flows/new"
            className={`${adminTheme.button.primary} inline-flex items-center`}
          >
            <FileText className="h-4 w-4 mr-2" />
            New Flow
          </a>
          <a
            href="/admin/bookings"
            className={`${adminTheme.button.secondary} inline-flex items-center`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Bookings
          </a>
          <a
            href="/admin/analytics"
            className={`${adminTheme.button.secondary} inline-flex items-center`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={adminTheme.layout.grid.cols4}>
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`${adminTheme.card.base} ${adminTheme.card.padding.md} ${adminTheme.card.hover}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`${adminTheme.typography.caption} mb-2`}>
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center">
                  <TrendingUp className={`h-3 w-3 ${stat.changeColor} mr-1`} />
                  <span className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`bg-primary p-3 rounded-md`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className={adminTheme.layout.grid.cols2}>
        {/* Recent Flows */}
        <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={adminTheme.typography.h3}>
              Recent Flows
            </h3>
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {recentFlows?.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-1">
                  <p className={`${adminTheme.typography.body} font-medium`}>
                    {flow.title}
                  </p>
                  <p className={`${adminTheme.typography.caption} mt-0.5`}>
                    {new Date(flow.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={flow.status === 'published' ? adminTheme.badge.success : adminTheme.badge.warning}>
                  {flow.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={adminTheme.typography.h3}>
              Recent Demo Bookings
            </h3>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {recentBookings?.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-1">
                  <p className={`${adminTheme.typography.body} font-medium`}>
                    {booking.name}
                  </p>
                  <p className={`${adminTheme.typography.caption} mt-0.5`}>
                    {booking.company} • {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={
                  booking.status === 'confirmed' ? adminTheme.badge.success :
                  booking.status === 'pending' ? adminTheme.badge.warning :
                  adminTheme.badge.info
                }>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
