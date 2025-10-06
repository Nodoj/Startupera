import { getFlow, getPublishedFlowIds, getPublishedFlows } from "@/lib/actions/flows";
import FlowDetailsBlog from "@/components/Flows/FlowDetailsBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const flow = await getFlow(id);
  
  if (!flow || flow.status !== 'published') {
    return {
      title: "Flow Not Found",
    };
  }

  return {
    title: `${flow.title} | AI Automation Flow`,
    description: flow.meta_description || flow.description || flow.excerpt || '',
    keywords: flow.meta_keywords || [],
  };
}

export async function generateStaticParams() {
  // Use build-time client that doesn't require cookies
  const flows = await getPublishedFlowIds();
  return flows.map((flow) => ({
    id: flow.id,
  }));
}

const FlowDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const flow = await getFlow(id);

  if (!flow || flow.status !== 'published') {
    notFound();
  }

  // Get related flows if specified
  const relatedFlows = flow.related_flows && flow.related_flows.length > 0
    ? await Promise.all(
        flow.related_flows.slice(0, 3).map(async (relatedId) => {
          const related = await getFlow(relatedId);
          return related && related.status === 'published' ? related : null;
        })
      ).then(flows => flows.filter(Boolean))
    : [];

  // Get latest 3 published flows (excluding current flow)
  const allFlows = await getPublishedFlows();
  const latestFlows = allFlows
    .filter(f => f.id !== flow.id) // Exclude current flow
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <>
      <Breadcrumb
        pageName={flow.title}
        description={flow.excerpt || flow.description || ''}
      />
      <FlowDetailsBlog 
        flow={flow} 
        relatedFlows={relatedFlows}
        latestFlows={latestFlows}
      />
    </>
  );
};

export default FlowDetailsPage;
