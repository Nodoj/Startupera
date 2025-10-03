import TwoColumnFlowForm from '@/components/Admin/TwoColumnFlowForm'

export default function NewFlowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Flow
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Add a new AI automation flow to showcase your capabilities.
        </p>
      </div>

      <TwoColumnFlowForm />
    </div>
  )
}
