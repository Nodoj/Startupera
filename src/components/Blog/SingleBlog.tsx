import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

interface SingleBlogProps {
  blog: Blog;
  viewMode?: 'grid' | 'list';
}

const SingleBlog = ({ blog, viewMode = 'grid' }: SingleBlogProps) => {
  const { title, image, paragraph, author, tags, publishDate } = blog;
  if (viewMode === 'list') {
    return (
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xl bg-white duration-300 mb-6">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 lg:w-1/4">
            <Link
              href="/blog-details"
              className="relative block aspect-video md:aspect-square w-full"
            >
              <span className="bg-primary absolute top-4 right-4 z-20 inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold text-white capitalize">
                {tags[0]}
              </span>
              <Image src={image} alt="image" fill className="object-cover" />
            </Link>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="mb-3">
                  <Link
                    href="/blog-details"
                    className="hover:text-primary dark:hover:text-primary block text-xl font-bold text-black lg:text-2xl dark:text-white line-clamp-2"
                  >
                    {title}
                  </Link>
                </h3>
                
                <p className="text-body-color mb-4 text-base font-medium line-clamp-3">
                  {paragraph}
                </p>
              </div>
              
              {/* Author and Date */}
              <div className="flex items-center justify-between pt-4 border-t border-body-color/10 dark:border-white/10">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image src={author.image} alt="author" fill />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-dark text-sm font-medium dark:text-white">
                      By {author.name}
                    </h4>
                    <p className="text-body-color text-xs">{author.designation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body-color text-xs">{publishDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xl bg-white duration-300">
      <Link
        href="/blog-details"
        className="relative block aspect-37/22 w-full"
      >
        <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
          {tags[0]}
        </span>
        <Image src={image} alt="image" fill className="object-cover" />
      </Link>
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        <h3>
          <Link
            href="/blog-details"
            className="hover:text-primary dark:hover:text-primary mb-4 block text-xl font-bold text-black sm:text-2xl dark:text-white"
          >
            {title}
          </Link>
        </h3>
        <p className="border-body-color/10 text-body-color mb-6 border-b pb-6 text-base font-medium dark:border-white/10">
          {paragraph}
        </p>
        <div className="flex items-center">
          <div className="border-body-color/10 mr-5 flex items-center border-r pr-5 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5 dark:border-white/10">
            <div className="mr-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={author.image} alt="author" fill />
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">
                By {author.name}
              </h4>
              <p className="text-body-color text-xs">{author.designation}</p>
            </div>
          </div>
          <div className="inline-block">
            <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">
              Date
            </h4>
            <p className="text-body-color text-xs">{publishDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
