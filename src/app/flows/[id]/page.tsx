import FlowDetails from "@/components/Flows/FlowDetails";
import flowsData from "@/components/Flows/flowsData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const flow = flowsData.find((flow) => flow.id === parseInt(id));
  
  if (!flow) {
    return {
      title: "Flow Not Found",
    };
  }

  return {
    title: `${flow.title} | Automation Flow Details`,
    description: flow.paragraph,
  };
}

export async function generateStaticParams() {
  return flowsData.map((flow) => ({
    id: flow.id.toString(),
  }));
}

const FlowDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const flow = flowsData.find((flow) => flow.id === parseInt(id));

  if (!flow) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        pageName={flow.title}
        description={flow.paragraph}
      />
      <FlowDetails flow={flow} />
    </>
  );
};

export default FlowDetailsPage;
