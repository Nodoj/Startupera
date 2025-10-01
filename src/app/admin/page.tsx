import { createClient } from '@/utils/supabase/server'
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
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Demo Bookings',
      value: demoBookingsCount || 0,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Contact Submissions',
      value: contactSubmissionsCount || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Total Views',
      value: '2,847',
      icon: Eye,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with your AI automation platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Flows */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Flows
          </h3>
          <div className="space-y-3">
            {recentFlows?.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {flow.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(flow.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  flow.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {flow.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Demo Bookings
          </h3>
          <div className="space-y-3">
            {recentBookings?.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.company} • {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/flows/new"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Create New Flow</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Add a new AI automation flow</p>
            </div>
          </a>
          
          <a
            href="/admin/bookings"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">Manage Bookings</p>
              <p className="text-sm text-green-600 dark:text-green-400">View and manage demo bookings</p>
            </div>
          </a>
          
          <a
            href="/admin/analytics"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">View Analytics</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Check performance metrics</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
