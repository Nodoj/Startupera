import { createClient } from '@/utils/supabase/server'
import { Calendar, Clock, User, Building, Phone, Mail, MessageSquare } from 'lucide-react'

export default async function AdminBookingsPage() {
  const supabase = await createClient()
  
  const { data: bookings, error } = await supabase
    .from('demo_bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Demo Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage demo appointments and client consultations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: bookings?.length || 0, color: 'bg-blue-500' },
          { label: 'Pending', value: bookings?.filter(b => b.status === 'pending').length || 0, color: 'bg-yellow-500' },
          { label: 'Confirmed', value: bookings?.filter(b => b.status === 'confirmed').length || 0, color: 'bg-green-500' },
          { label: 'Completed', value: bookings?.filter(b => b.status === 'completed').length || 0, color: 'bg-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Bookings
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {!bookings || bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Demo bookings will appear here when clients schedule appointments.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {booking.name}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.email}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.company}
                          </span>
                        </div>

                        {booking.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.phone}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.booking_time}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      {booking.message && (
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.message}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        {booking.status === 'pending' && (
                          <>
                            <button className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                              Confirm
                            </button>
                            <button className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                            Mark Complete
                          </button>
                        )}
                        <button className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                          Send Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
