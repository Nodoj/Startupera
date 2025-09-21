import Pricing from "@/components/Pricing";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Page | Free Next.js Template for Startup and SaaS",
  description: "This is Pricing Page for Startup Nextjs Template",
  // other metadata
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Pricing Plans"
        description="Choose the perfect plan for your needs. Simple and transparent pricing with no hidden fees."
      />
      <Pricing />
    </>
  );
};

export default PricingPage;
