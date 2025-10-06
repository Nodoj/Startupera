import { getFlows } from '@/lib/actions/flows'
import FlowsListWithFilters from '@/components/Admin/FlowsListWithFilters'

export default async function AdminFlowsPage() {
  const flows = await getFlows()

  return <FlowsListWithFilters flows={flows} />
}
