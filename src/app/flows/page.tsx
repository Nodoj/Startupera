import FlowsWithFilters from "@/components/Flows/FlowsWithFilters";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { getPublishedFlows } from "@/lib/actions/flows";

export const metadata: Metadata = {
  title: "Automation Flows | Real-World AI Solutions & Case Studies",
  description: "Explore our comprehensive automation workflows from file analysis to custom AI RAG systems for enterprise support. See how we transform business processes with intelligent automation.",
  // other metadata
};

const FlowsPage = async () => {
  // Fetch published flows from database
  const dbFlows = await getPublishedFlows();
  
  return (
    <>
      <Breadcrumb
        pageName="Automation Flows"
        description="Discover real-world automation solutions that transform businesses. From intelligent file processing to enterprise-grade AI support systems - see what's possible with our expertise."
      />
      <FlowsWithFilters dbFlows={dbFlows} />
    </>
  );
};

export default FlowsPage;
