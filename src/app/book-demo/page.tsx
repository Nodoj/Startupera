import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import DemoBooking from "@/components/DemoBooking";

export const metadata: Metadata = {
  title: "Book a Demo | AI Automation Solutions",
  description: "Schedule a personalized demo of our AI automation solutions. Book a convenient time slot to see how our custom AI systems can transform your business operations.",
  keywords: "book demo, AI automation demo, schedule consultation, AI solutions demo, custom AI demo",
};

export default function BookDemoPage() {
  return (
    <>
      <Breadcrumb
        pageName="Book a Demo"
        description="Schedule a personalized demonstration of our AI automation solutions and discover how we can transform your business operations."
      />
      <DemoBooking />
    </>
  );
}
