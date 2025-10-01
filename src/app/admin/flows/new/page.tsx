import FlowForm from '@/components/Admin/FlowForm'

export default function NewFlowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Flow
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add a new AI automation flow to showcase your capabilities.
        </p>
      </div>

      <FlowForm />
    </div>
  )
}
