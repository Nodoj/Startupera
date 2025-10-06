import LoadingSpinner from '@/components/Admin/LoadingSpinner'

export default function FlowsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Loading flows..." />
      </div>
    </div>
  )
}
