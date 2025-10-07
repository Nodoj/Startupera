import { Flow } from "@/types/flow";
import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp, Zap, ArrowRight, User, Calendar } from "lucide-react";

interface SingleFlowProps {
  flow: Flow;
  viewMode?: 'grid' | 'list';
}

const SingleFlow = ({ flow, viewMode = 'grid' }: SingleFlowProps) => {
  const { title, paragraph, author, tags, publishDate, complexity, timeToImplement, roi } = flow;
  
  if (viewMode === 'list') {
    return (
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xl bg-white duration-300 mb-6 border border-stroke/10 dark:border-stroke-dark/10 z-0">
        <div className="flex flex-col md:flex-row">
          {/* Featured Image */}
          {flow.image && (
            <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 p-4 md:p-0 md:pl-4 md:pt-4 md:pb-4">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-stroke/20 dark:border-stroke-dark/20">
                <Image
                  src={flow.image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="mb-4">
              <Link
                href={`/flows/${flow.id}`}
                className="hover:text-primary dark:hover:text-primary block text-xl font-bold text-black lg:text-2xl dark:text-white line-clamp-2 group-hover:text-primary transition-colors"
              >
                {title}
              </Link>
            </h3>
          
          {/* Flow Metrics */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-sm">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">{complexity}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2 text-sm">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-medium">{timeToImplement}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-4 py-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">{roi}</span>
            </div>
          </div>
          
          {/* Author and Date */}
          <div className="flex items-center justify-between pt-4 border-t border-stroke/20 dark:border-stroke-dark/20 mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-body-color dark:text-body-color-dark">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{author.name}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-body-color/30"></div>
              <div className="flex items-center gap-2 text-body-color dark:text-body-color-dark">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{publishDate}</span>
              </div>
            </div>
            
            {/* Read More Button */}
            <Link
              href={`/flows/${flow.id}`}
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors group/link"
            >
              <span>Read Full</span>
              <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xl bg-white duration-300 border border-stroke/10 dark:border-stroke-dark/10 h-full z-0 flex flex-col">
      {/* Featured Image */}
      {flow.image && (
        <div className="p-4 pb-0">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-stroke/20 dark:border-stroke-dark/20">
            <Image
              src={flow.image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
      
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8 flex flex-col flex-1">
        {/* Title */}
        <h3 className="mb-4">
          <Link
            href={`/flows/${flow.id}`}
            className="hover:text-primary dark:hover:text-primary block text-xl font-bold text-black sm:text-2xl dark:text-white group-hover:text-primary transition-colors line-clamp-2"
          >
            {title}
          </Link>
        </h3>
        
        {/* Flow Metrics */}
        <div className="mb-6 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-1.5 text-xs">
            <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">{complexity}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">{timeToImplement}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-3 py-1.5 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-300 font-medium">{roi}</span>
          </div>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between pt-4 border-t border-stroke/20 dark:border-stroke-dark/20 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-body-color dark:text-body-color-dark">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{author.name}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-body-color/30"></div>
            <div className="flex items-center gap-2 text-body-color dark:text-body-color-dark">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{publishDate}</span>
            </div>
          </div>
          
          {/* Read More Button */}
          <Link
            href={`/flows/${flow.id}`}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors group/link"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleFlow;
