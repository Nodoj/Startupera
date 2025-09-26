import BlogWithFilters from "@/components/Blog/BlogWithFilters";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AI & Automation Insights",
  description: "Discover insights, tutorials, and industry knowledge from our team of experts. Stay updated with the latest trends in AI, automation, and technology.",
  // other metadata
};

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Blog Grid"
        description="Discover insights, tutorials, and industry knowledge from our team of experts. Stay updated with the latest trends in AI, automation, and technology."
      />
      <BlogWithFilters />
    </>
  );
};

export default Blog;
