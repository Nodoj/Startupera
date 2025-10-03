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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
    setViewMode(newViewMode);
  };

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="container">
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
          {filteredAndSortedFlows.length > 0 ? (
            filteredAndSortedFlows.map((flow) => (
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

        {/* Pagination - Show only if there are results */}
        {filteredAndSortedFlows.length > 0 && (
          <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <a
                    href="#0"
                    className="bg-body-color/15 text-body-color hover:bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition hover:text-white"
                  >
                    Prev
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="bg-body-color/15 text-body-color hover:bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition hover:text-white"
                  >
                    1
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="bg-body-color/15 text-body-color hover:bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition hover:text-white"
                  >
                    2
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="#0"
                    className="bg-body-color/15 text-body-color hover:bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition hover:text-white"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlowsWithFilters;
