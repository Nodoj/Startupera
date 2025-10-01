import { getContactSubmissions } from '@/lib/actions/contact'
import { Mail, User, Building, MessageSquare, Clock } from 'lucide-react'

export default async function AdminContactsPage() {
  const contacts = await getContactSubmissions()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'read':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'replied':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contact Submissions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage client inquiries and project requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Submissions', value: contacts?.length || 0, color: 'bg-blue-500' },
          { label: 'New', value: contacts?.filter(c => c.status === 'new').length || 0, color: 'bg-green-500' },
          { label: 'Replied', value: contacts?.filter(c => c.status === 'replied').length || 0, color: 'bg-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Submissions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Submissions
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {!contacts || contacts.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No contact submissions yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Contact form submissions will appear here when clients reach out.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {contact.name}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {contact.email}
                          </span>
                        </div>
                        
                        {contact.subject && (
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {contact.subject}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {contact.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        {contact.status === 'new' && (
                          <button className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                            Mark as Read
                          </button>
                        )}
                        {contact.status !== 'replied' && (
                          <button className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                            Mark as Replied
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                          Send Email
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                          Archive
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
