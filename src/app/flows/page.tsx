import FlowsWithFilters from "@/components/Flows/FlowsWithFilters";
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
      <FlowsWithFilters dbFlows={dbFlows} />
    </>
  );
};

export default FlowsPage;
