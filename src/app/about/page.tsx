import ComprehensiveAbout from "@/components/About/ComprehensiveAbout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Toraflow | Passionate AI & Technology Experts",
  description: "Meet our passionate team of 4 core technicians with 15+ years experience. We build custom AI solutions, enterprise software, and infrastructure with no limitations. Your dreams, our expertise.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <ComprehensiveAbout />
    </>
  );
};

export default AboutPage;
