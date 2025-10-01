import AboutSectionOne from "@/components/About/AboutSectionOne";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import RagFlow from "@/components/RagFlow";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom AI Solutions & automation",
  description: "We build custom AI solutions for businesses of all sizes. Our team of experts can help you implement AI in your business and transform the way you do things.",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <AboutSectionOne />
      <RagFlow />
      <Brands />
      <Team />
      <Testimonials />
      <Contact />
    </>
  );
}
