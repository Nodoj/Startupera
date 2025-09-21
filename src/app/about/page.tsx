import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team/";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Custom AI Solutions & Data Security Experts",
  description: "Leading AI agency specializing in custom AI solutions, local deployments, and enterprise data security. Transform your business with secure, tailored AI automation.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Our AI Agency"
        description="Discover how we're revolutionizing businesses with custom AI solutions, secure local deployments, and enterprise-grade data protection. Your trusted partner in AI transformation."
      />
      <AboutSectionTwo />
      <Team />
      <AboutSectionOne />
    </>
  );
};

export default AboutPage;
