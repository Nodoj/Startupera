import FlowDetails from "@/components/Flows/FlowDetails";
import flowsData from "@/components/Flows/flowsData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const flow = flowsData.find((flow) => flow.id === parseInt(params.id));
  
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

const FlowDetailsPage = ({ params }: Props) => {
  const flow = flowsData.find((flow) => flow.id === parseInt(params.id));

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
