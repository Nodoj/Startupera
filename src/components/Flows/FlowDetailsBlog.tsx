"use client";

import type { Database } from "@/types/database";
import Image from "next/image";
import { 
  Clock, 
  TrendingUp, 
  Zap, 
  Share2,
  Code,
  Users,
  ArrowRight,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Workflow,
  BookOpen,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PremiumGallery from "./PremiumGallery";

type Flow = Database['public']['Tables']['flows']['Row']

interface FlowDetailsBlogProps {
  flow: Flow & {
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  relatedFlows?: Flow[];
  latestFlows?: Flow[];
}

const FlowDetailsBlog = ({ 
  flow,
  relatedFlows = [],
  latestFlows = []
}: FlowDetailsBlogProps) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Parse JSONB fields safely
  const sections = (flow.sections as any[]) || [];
  const useCases = (flow.use_cases as any[]) || [];
  const implementationSteps = (flow.implementation_steps as any[]) || [];
  const benefits = (flow.benefits as any[]) || [];
  const faq = (flow.faq as any[]) || [];
  const gallery = (flow.gallery as string[]) || [];

  // Check if we should show gallery instead of featured image
  const hasGallery = gallery.length > 0;
  const showFeaturedImage = !hasGallery && flow.featured_image;
  
  return (
    <section className="pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-28 lg:pt-32">
      {/* Custom styles for flow content */}
      <style jsx global>{`
        .flow-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
          line-height: 1.2;
          color: inherit;
        }
        .flow-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
          line-height: 1.3;
          color: inherit;
        }
        .flow-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
          line-height: 1.4;
          color: inherit;
        }
        .flow-content ul,
        .flow-content ol {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        .flow-content li {
          margin-bottom: 0.25rem;
        }
        .flow-content blockquote {
          border-left: 4px solid #4A6CF7;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        .flow-content code {
          background-color: rgba(74, 108, 247, 0.1);
          color: #4A6CF7;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .flow-content pre {
          background-color: #1a1a1a;
          color: #fff;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .flow-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        .flow-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .flow-content a {
          color: #4A6CF7;
          text-decoration: underline;
        }
        .flow-content a:hover {
          opacity: 0.8;
        }
        .flow-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
      `}</style>
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          {/* Main Content - Left Side */}
          <div className="w-full px-4 lg:w-8/12 xl:w-9/12">
            
            {/* Hero Header - Matching Global Style */}
            <div className="mb-8 sm:mb-10">
              {/* Category Badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                  {flow.category}
                </span>
                {flow.categories && flow.categories.slice(1).map((cat, idx) => (
                  <span key={idx} className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {cat}
                  </span>
                ))}
              </div>
              {/* Title - Matching SectionTitle Style */}
              <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
                {flow.title}
              </h1>

              {/* Excerpt */}
              {flow.excerpt && (
                <p className="mb-6 text-base leading-relaxed text-body-color md:text-lg">
                  {flow.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-body-color dark:text-body-color-dark">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(flow.created_at).toLocaleDateString()}</span>
                </div>
                {flow.reading_time && (
                  <>
                    <div className="h-1 w-1 rounded-full bg-body-color/30"></div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{flow.reading_time} min read</span>
                    </div>
                  </>
                )}
                {flow.profiles && (
                  <>
                    <div className="h-1 w-1 rounded-full bg-body-color/30"></div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{flow.profiles.full_name}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Stats - Simplified */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-black dark:text-white capitalize">{flow.complexity}</span>
                </div>
                {flow.time_to_implement && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-black dark:text-white">{flow.time_to_implement}</span>
                  </div>
                )}
                {flow.roi && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-black dark:text-white">{flow.roi}</span>
                  </div>
                )}
              </div>
            </div>


            {/* Premium Gallery Carousel (if gallery exists) */}
            {hasGallery && (
              <PremiumGallery images={gallery} title={flow.title} />
            )}

            {/* Featured Image (only if no gallery) */}
            {showFeaturedImage && (
              <div className="mb-10 overflow-hidden rounded-xl">
                <div className="relative h-[400px] w-full">
                  <Image
                    src={flow.featured_image}
                    alt={flow.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Technologies Stack - Moved here */}
            {flow.technologies && flow.technologies.length > 0 && (
              <div id="technologies" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Technologies & Stack
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {flow.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content */}
            {(flow.content || flow.description) && (
              <div id="overview" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <div 
                  className="flow-content prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white prose-p:text-body-color dark:prose-p:text-body-color-dark prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-black dark:prose-strong:text-white prose-ul:text-body-color dark:prose-ul:text-body-color-dark prose-ol:text-body-color dark:prose-ol:text-body-color-dark prose-li:marker:text-primary prose-blockquote:border-l-primary prose-blockquote:text-body-color dark:prose-blockquote:text-body-color-dark prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: flow.content || flow.description || '' }}
                />
              </div>
            )}

            {/* Dynamic Sections */}
            {sections.length > 0 && sections.map((section: any, index: number) => (
              <div key={index} id={`section-${index}`} className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                  {section.title}
                </h2>
                <div 
                  className="flow-content prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}

            {/* Use Cases */}
            {useCases.length > 0 && (
              <div id="use-cases" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Real-World Use Cases
                  </h2>
                </div>
                <div className="space-y-6">
                  {useCases.map((useCase: any, index: number) => (
                    <div key={index} className="rounded-lg border border-stroke dark:border-stroke-dark p-6">
                      <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
                        {useCase.title}
                      </h3>
                      {useCase.industry && (
                        <span className="mb-3 inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                          {useCase.industry}
                        </span>
                      )}
                      <p className="text-body-color dark:text-body-color-dark">
                        {useCase.description}
                      </p>
                      {useCase.results && (
                        <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">
                            <CheckCircle className="mr-2 inline h-4 w-4" />
                            {useCase.results}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation Steps */}
            {implementationSteps.length > 0 && (
              <div id="implementation" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Step-by-Step Implementation
                  </h2>
                </div>
                <div className="space-y-6">
                  {implementationSteps.map((step: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                          {step.title}
                        </h3>
                        <p className="mb-3 text-body-color dark:text-body-color-dark">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.duration && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {step.duration}
                            </span>
                          )}
                          {step.difficulty && (
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              step.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                              step.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}>
                              {step.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <div id="benefits" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Key Benefits & ROI
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {benefits.map((benefit: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      <div>
                        <h4 className="mb-1 font-semibold text-black dark:text-white">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-body-color dark:text-body-color-dark">
                          {benefit.description}
                        </p>
                        {benefit.metric && (
                          <p className="mt-2 text-lg font-bold text-primary">
                            {benefit.metric}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {flow.prerequisites && flow.prerequisites.length > 0 && (
              <div id="prerequisites" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    Prerequisites
                  </h2>
                </div>
                <ul className="space-y-2">
                  {flow.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-body-color dark:text-body-color-dark">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
              <div id="faq" className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faq.map((item: any, index: number) => (
                    <div key={index} className="rounded-lg border border-stroke dark:border-stroke-dark">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="flex w-full items-center justify-between p-4 text-left"
                      >
                        <span className="font-semibold text-black dark:text-white">
                          {item.question}
                        </span>
                        {openFAQ === index ? (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-body-color" />
                        )}
                      </button>
                      {openFAQ === index && (
                        <div className="border-t border-stroke dark:border-stroke-dark p-4">
                          <p className="text-body-color dark:text-body-color-dark">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Flows */}
            {relatedFlows.length > 0 && (
              <div className="shadow-one dark:bg-dark rounded-xl bg-white p-8 sm:p-11 mb-10">
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                  Related Automation Flows
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedFlows.map((related) => (
                    <Link
                      key={related.id}
                      href={`/flows/${related.id}`}
                      className="group rounded-lg border border-stroke dark:border-stroke-dark p-4 transition-all hover:border-primary hover:shadow-lg"
                    >
                      {related.featured_image && (
                        <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg">
                          <Image
                            src={related.featured_image}
                            alt={related.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <h3 className="mb-2 font-semibold text-black dark:text-white group-hover:text-primary">
                        {related.title}
                      </h3>
                      <p className="text-sm text-body-color dark:text-body-color-dark line-clamp-2">
                        {related.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Flow Navigation - Enhanced Preview Cards */}
            <div className="mt-10 border-t border-stroke dark:border-stroke-dark pt-10">
              <h3 className="mb-6 text-xl font-bold text-black dark:text-white">
                Continue Exploring
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Previous Flow Card */}
                {relatedFlows[0] && (
                  <Link
                    href={`/flows/${relatedFlows[0].id}`}
                    className="group relative overflow-hidden rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-dark transition-all hover:border-primary hover:shadow-lg"
                  >
                    {/* Image */}
                    {relatedFlows[0].featured_image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={relatedFlows[0].featured_image}
                          alt={relatedFlows[0].title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                            <ArrowRight className="h-3 w-3 rotate-180" />
                            Previous
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {relatedFlows[0].category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-body-color dark:text-body-color-dark">
                          <Zap className="h-3 w-3" />
                          {relatedFlows[0].complexity}
                        </span>
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-black dark:text-white group-hover:text-primary line-clamp-2">
                        {relatedFlows[0].title}
                      </h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark line-clamp-2">
                        {relatedFlows[0].excerpt || relatedFlows[0].description}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Next Flow Card */}
                {relatedFlows[1] && (
                  <Link
                    href={`/flows/${relatedFlows[1].id}`}
                    className="group relative overflow-hidden rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-dark transition-all hover:border-primary hover:shadow-lg"
                  >
                    {/* Image */}
                    {relatedFlows[1].featured_image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={relatedFlows[1].featured_image}
                          alt={relatedFlows[1].title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                            Next
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {relatedFlows[1].category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-body-color dark:text-body-color-dark">
                          <Zap className="h-3 w-3" />
                          {relatedFlows[1].complexity}
                        </span>
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-black dark:text-white group-hover:text-primary line-clamp-2">
                        {relatedFlows[1].title}
                      </h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark line-clamp-2">
                        {relatedFlows[1].excerpt || relatedFlows[1].description}
                      </p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Latest 3 Flows */}
              {latestFlows.length > 0 && (
                <div className="mt-8">
                  <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Latest Flows
                  </h4>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {latestFlows.map((latestFlow) => (
                      <Link
                        key={latestFlow.id}
                        href={`/flows/${latestFlow.id}`}
                        className="group relative overflow-hidden rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-dark transition-all hover:border-primary hover:shadow-lg"
                      >
                        {/* Image */}
                        {latestFlow.featured_image && (
                          <div className="relative h-40 w-full overflow-hidden">
                            <Image
                              src={latestFlow.featured_image}
                              alt={latestFlow.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                              {latestFlow.category}
                            </span>
                            {latestFlow.reading_time && (
                              <span className="flex items-center gap-1 text-xs text-body-color dark:text-body-color-dark">
                                <Clock className="h-3 w-3" />
                                {latestFlow.reading_time} min
                              </span>
                            )}
                          </div>
                          <h5 className="mb-2 text-base font-bold text-black dark:text-white group-hover:text-primary line-clamp-2">
                            {latestFlow.title}
                          </h5>
                          <p className="text-xs text-body-color dark:text-body-color-dark line-clamp-2">
                            {latestFlow.excerpt || latestFlow.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* View All Flows Link */}
                  <div className="mt-6 text-center">
                    <Link
                      href="/flows"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      View All Flows
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar - Right Side */}
          <div className="w-full px-4 lg:w-4/12 xl:w-3/12">
            <div className="sticky top-24 space-y-6">
              
              {/* Categories Menu */}
              <div className="shadow-one dark:bg-dark rounded-xl bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                  Browse by Category
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/flows?category=automation"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>Automation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/flows?category=ai-chatbots"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>AI Chatbots</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/flows?category=data-processing"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>Data Processing</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/flows?category=content-generation"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>Content Generation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/flows?category=workflow-automation"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>Workflow Automation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/flows"
                    className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-stroke dark:border-stroke-dark px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    View All Categories
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Table of Contents */}
              {(sections.length > 0 || useCases.length > 0 || implementationSteps.length > 0 || benefits.length > 0 || faq.length > 0) && (
                <div className="shadow-one dark:bg-dark rounded-xl bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                    On This Page
                  </h3>
                  <nav className="space-y-2 text-sm">
                    {(flow.content || flow.description) && (
                      <a href="#overview" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        Overview
                      </a>
                    )}
                    {sections.length > 0 && sections.map((section: any, idx: number) => (
                      <a key={idx} href={`#section-${idx}`} className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        {section.title}
                      </a>
                    ))}
                    {useCases.length > 0 && (
                      <a href="#use-cases" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        Use Cases
                      </a>
                    )}
                    {implementationSteps.length > 0 && (
                      <a href="#implementation" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        Implementation
                      </a>
                    )}
                    {benefits.length > 0 && (
                      <a href="#benefits" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        Benefits & ROI
                      </a>
                    )}
                    {flow.technologies && flow.technologies.length > 0 && (
                      <a href="#technologies" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        Technologies
                      </a>
                    )}
                    {flow.prerequisites && flow.prerequisites.length > 0 && (
                      <a href="#prerequisites" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        Prerequisites
                      </a>
                    )}
                    {faq.length > 0 && (
                      <a href="#faq" className="block text-body-color hover:text-primary dark:text-body-color-dark transition-colors">
                        FAQ
                      </a>
                    )}
                  </nav>
                </div>
              )}

              {/* CTA Card */}
              <div className="shadow-one dark:bg-dark rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 p-6">
                <h3 className="mb-3 text-lg font-bold text-black dark:text-white">
                  Ready to Get Started?
                </h3>
                <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">
                  Let&apos;s discuss how we can implement this automation for your business.
                </p>
                <Link
                  href="/book-demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  <Users className="h-4 w-4" />
                  Book Consultation
                </Link>
              </div>

              {/* Key Highlights */}
              {(useCases.length > 0 || benefits.length > 0 || implementationSteps.length > 0) && (
                <div className="shadow-one dark:bg-dark rounded-xl bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                    Key Highlights
                  </h3>
                  <div className="space-y-3">
                    {useCases.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {useCases.length} real-world use {useCases.length === 1 ? 'case' : 'cases'}
                        </span>
                      </div>
                    )}
                    {implementationSteps.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {implementationSteps.length}-step implementation guide
                        </span>
                      </div>
                    )}
                    {benefits.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {benefits.length} proven {benefits.length === 1 ? 'benefit' : 'benefits'} with ROI metrics
                        </span>
                      </div>
                    )}
                    {flow.technologies && flow.technologies.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {flow.technologies.length} technologies integrated
                        </span>
                      </div>
                    )}
                    {flow.prerequisites && flow.prerequisites.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {flow.prerequisites.length} prerequisites to check
                        </span>
                      </div>
                    )}
                    {faq.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {faq.length} FAQs answered
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Share Card */}
              <div className="shadow-one dark:bg-dark rounded-xl bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
                  Share This Flow
                </h3>
                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke dark:border-stroke-dark transition-colors hover:bg-primary hover:text-white hover:border-primary">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke dark:border-stroke-dark transition-colors hover:bg-primary hover:text-white hover:border-primary">
                    <Code className="h-4 w-4" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke dark:border-stroke-dark transition-colors hover:bg-primary hover:text-white hover:border-primary">
                    <BookOpen className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FlowDetailsBlog;
