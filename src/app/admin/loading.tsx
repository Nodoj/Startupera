import LoadingSpinner from '@/components/Admin/LoadingSpinner'

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" text="Loading admin panel..." />
    </div>
  )
}
