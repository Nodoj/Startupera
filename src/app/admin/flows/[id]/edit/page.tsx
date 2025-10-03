import { getFlow } from '@/lib/actions/flows'
import TwoColumnFlowForm from '@/components/Admin/TwoColumnFlowForm'
import { adminTheme } from '@/styles/admin-theme'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditFlowPage({ params }: Props) {
  const { id } = await params
  const flow = await getFlow(id)

  if (!flow) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={adminTheme.typography.h1}>
          Edit Flow
        </h1>
        <p className={`${adminTheme.typography.body} mt-1`}>
          Update your AI automation flow details.
        </p>
      </div>

      <TwoColumnFlowForm initialData={flow} isEditing={true} />
    </div>
  )
}
