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
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Category Tag */}
              <div className="mb-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-semibold text-primary capitalize">
                  {tags[0]}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="mb-3">
                <Link
                  href={`/flows/${flow.id}`}
                  className="hover:text-primary dark:hover:text-primary block text-xl font-bold text-black lg:text-2xl dark:text-white line-clamp-2 group-hover:text-primary transition-colors"
                >
                  {title}
                </Link>
              </h3>
            </div>
            
            {/* Action Button */}
            <Link
              href={`/flows/${flow.id}`}
              className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 group-hover:bg-primary group-hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {/* Description */}
          <p className="text-body-color mb-6 text-base font-medium line-clamp-3 leading-relaxed">
            {paragraph}
          </p>
          
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
          <div className="flex items-center justify-between pt-4 border-t border-stroke/20 dark:border-stroke-dark/20">
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
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xl bg-white duration-300 border border-stroke/10 dark:border-stroke-dark/10 h-full z-0">
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Category Tag */}
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-semibold text-primary capitalize">
                {tags[0]}
              </span>
            </div>
            
            {/* Title */}
            <h3>
              <Link
                href={`/flows/${flow.id}`}
                className="hover:text-primary dark:hover:text-primary mb-4 block text-xl font-bold text-black sm:text-2xl dark:text-white group-hover:text-primary transition-colors line-clamp-2"
              >
                {title}
              </Link>
            </h3>
          </div>
          
          {/* Action Button */}
          <Link
            href={`/flows/${flow.id}`}
            className="ml-3 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 group-hover:bg-primary group-hover:text-white flex-shrink-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {/* Description */}
        <div className="flex-1">
          <p className="text-body-color mb-6 text-base font-medium line-clamp-4 leading-relaxed">
            {paragraph}
          </p>
        </div>
        
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
        </div>
      </div>
    </div>
  );
};

export default SingleFlow;
