import ComprehensiveAbout from "@/components/About/ComprehensiveAbout";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Toraflow | Passionate AI & Technology Experts",
  description: "Meet our passionate team of 4 core technicians with 15+ years experience. We build custom AI solutions, enterprise software, and infrastructure with no limitations. Your dreams, our expertise.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Toraflow"
        description="Meet our passionate team of technology experts who turn dreams into reality. With 15+ years of experience and no limitations, we're here to build something meaningful just for you."
      />
      <ComprehensiveAbout />
    </>
  );
};

export default AboutPage;
