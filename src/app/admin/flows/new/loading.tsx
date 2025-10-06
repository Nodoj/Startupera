import LoadingSpinner from '@/components/Admin/LoadingSpinner'

export default function NewFlowLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Form Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <LoadingSpinner size="lg" text="Preparing form..." />
      </div>
    </div>
  )
}
