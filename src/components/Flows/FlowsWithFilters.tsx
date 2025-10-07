"use client";

import { useState, useMemo } from "react";
import SingleFlow from "./SingleFlow";
import ContentFilter, { FilterState } from "@/components/Common/ContentFilter";
import { filterContent, sortContent, generateFilterConfig } from "@/utils/filterUtils";
import { RouteOff } from "lucide-react";

interface FlowsWithFiltersProps {
  dbFlows?: any[];
}

const FlowsWithFilters = ({ dbFlows = [] }: FlowsWithFiltersProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 9 items per page (3x3 grid)
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    selectedTags: [],
    selectedAuthor: 'all',
    selectedYear: 'all',
    selectedComplexity: 'all',
    selectedTimeToImplement: 'all',
    selectedTechnologies: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Convert database flows to display format
  const allFlows = useMemo(() => {
    // Convert DB flows to match the flowsData format
    const convertedDbFlows = dbFlows.map(flow => ({
      id: flow.id,
      title: flow.title,
      description: flow.description,
      paragraph: flow.description, // Add paragraph for compatibility
      image: flow.featured_image || "/images/flows/default.jpg",
      category: flow.category,
      tags: flow.tags || [],
      complexity: flow.complexity,
      timeToImplement: flow.time_to_implement || "1-2 weeks",
      technologies: flow.technologies || [],
      author: flow.profiles?.full_name || "TORAFLOW Team",
      date: new Date(flow.created_at).toLocaleDateString(),
      publishDate: new Date(flow.created_at).toLocaleDateString(), // Add publishDate
      views: flow.views || 0,
      featured: flow.featured || false,
      roi: flow.roi || "High",
    }));
    
    // Only use database flows (no static data)
    return convertedDbFlows;
  }, [dbFlows]);

  // Generate filter configuration from flows data
  const filterConfig = useMemo(() => generateFilterConfig(allFlows, 'flows'), [allFlows]);

  // Apply filters and sorting
  const filteredAndSortedFlows = useMemo(() => {
    const filtered = filterContent(allFlows, filters, 'flows');
    return sortContent(filtered, filters.sortBy, filters.sortOrder, 'flows');
  }, [allFlows, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedFlows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFlows = filteredAndSortedFlows.slice(startIndex, endIndex);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
    setViewMode(newViewMode);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="pb-[120px]">
      <div className="container">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
            Explore Our Automation Flows
          </h2>
          <p className="mx-auto max-w-3xl text-base text-body-color dark:text-body-color-dark sm:text-lg">
            Browse through our collection of AI-powered automation workflows. Each flow represents a real-world solution designed to streamline operations, boost productivity, and drive business growth.
          </p>
        </div>

        {/* Filter Component */}
        <ContentFilter
          filterConfig={filterConfig}
          onFilterChange={handleFilterChange}
          onViewModeChange={handleViewModeChange}
          totalItems={allFlows.length}
          filteredItems={filteredAndSortedFlows.length}
          contentType="flows"
        />

        {/* Flows Grid/List */}
        <div className={viewMode === 'list' ? 'space-y-0' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'}>
          {paginatedFlows.length > 0 ? (
            paginatedFlows.map((flow) => (
              <div
                key={flow.id}
                className={viewMode === 'list' ? 'w-full' : ''}
              >
                <SingleFlow flow={flow} viewMode={viewMode} />
              </div>
            ))
          ) : (
            <div className={viewMode === 'list' ? 'w-full text-center py-16' : 'col-span-full text-center py-16'}>
              <div className="mx-auto max-w-md">
                <div className="mb-4 text-6xl justify-center items-center"><RouteOff size={64} /></div>
                
                <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
                  No flows found
                </h3>
                <p className="text-body-color dark:text-body-color-dark">
                  Try adjusting your filters or search terms to find more automation flows.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination - Show only if there are results and multiple pages */}
        {filteredAndSortedFlows.length > 0 && totalPages > 1 && (
          <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8 gap-1">
                {/* Previous Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                      currentPage === 1
                        ? 'bg-body-color/5 text-body-color/50 cursor-not-allowed'
                        : 'bg-body-color/15 text-body-color hover:bg-primary hover:text-white'
                    }`}
                  >
                    Prev
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  // Show ellipsis
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <li key={`ellipsis-${page}`}>
                        <span className="flex h-9 min-w-[36px] items-center justify-center px-2 text-body-color">
                          ...
                        </span>
                      </li>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <li key={page}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'bg-body-color/15 text-body-color hover:bg-primary hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}

                {/* Next Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                      currentPage === totalPages
                        ? 'bg-body-color/5 text-body-color/50 cursor-not-allowed'
                        : 'bg-body-color/15 text-body-color hover:bg-primary hover:text-white'
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>

              {/* Pagination Info */}
              <div className="text-center mt-4">
                <p className="text-sm text-body-color dark:text-body-color-dark">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedFlows.length)} of {filteredAndSortedFlows.length} flows
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlowsWithFilters;
