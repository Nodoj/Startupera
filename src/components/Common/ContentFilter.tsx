"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Calendar, 
  User, 
  Tag, 
  Zap, 
  Clock, 
  TrendingUp,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Check,
  Sparkles
} from "lucide-react";
import CustomSelect from "@/components/Admin/CustomSelect";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  categories?: FilterOption[];
  tags?: FilterOption[];
  authors?: FilterOption[];
  publishYears?: FilterOption[];
  complexity?: FilterOption[];
  timeToImplement?: FilterOption[];
  technologies?: FilterOption[];
}

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedTags: string[];
  selectedAuthor: string;
  selectedYear: string;
  selectedComplexity: string;
  selectedTimeToImplement: string;
  selectedTechnologies: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ContentFilterProps {
  filterConfig: FilterConfig;
  onFilterChange: (filters: FilterState) => void;
  onViewModeChange?: (viewMode: 'grid' | 'list') => void;
  totalItems: number;
  filteredItems: number;
  contentType: 'blog' | 'flows';
  className?: string;
}

const ContentFilter = ({
  filterConfig,
  onFilterChange,
  onViewModeChange,
  totalItems,
  filteredItems,
  contentType,
  className = ""
}: ContentFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Update parent component when view mode changes
  useEffect(() => {
    if (onViewModeChange) {
      onViewModeChange(viewMode);
    }
  }, [viewMode, onViewModeChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const toggleTechnology = (tech: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTechnologies: prev.selectedTechnologies.includes(tech)
        ? prev.selectedTechnologies.filter(t => t !== tech)
        : [...prev.selectedTechnologies, tech]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
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
  };

  const hasActiveFilters = filters.searchTerm || 
    filters.selectedCategory !== 'all' || 
    filters.selectedTags.length > 0 || 
    filters.selectedAuthor !== 'all' || 
    filters.selectedYear !== 'all' ||
    filters.selectedComplexity !== 'all' ||
    filters.selectedTimeToImplement !== 'all' ||
    filters.selectedTechnologies.length > 0;

  const activeFilterCount = [
    filters.selectedCategory !== 'all' ? 1 : 0,
    filters.selectedTags.length,
    filters.selectedAuthor !== 'all' ? 1 : 0,
    filters.selectedYear !== 'all' ? 1 : 0,
    filters.selectedComplexity !== 'all' ? 1 : 0,
    filters.selectedTimeToImplement !== 'all' ? 1 : 0,
    filters.selectedTechnologies.length
  ].reduce((sum, count) => sum + count, 0);

  const sortOptions = contentType === 'flows' 
    ? [
        { value: 'date', label: 'Latest First', icon: Calendar },
        { value: 'title', label: 'Title A-Z', icon: Tag },
        { value: 'complexity', label: 'Complexity', icon: Zap },
        { value: 'timeToImplement', label: 'Duration', icon: Clock },
        { value: 'roi', label: 'ROI', icon: TrendingUp }
      ]
    : [
        { value: 'date', label: 'Latest First', icon: Calendar },
        { value: 'title', label: 'Title A-Z', icon: Tag },
        { value: 'author', label: 'Author', icon: User }
      ];

  const FilterChip = ({ label, onRemove, color = 'primary' }: { label: string; onRemove: () => void; color?: string }) => (
    <div className={`inline-flex items-center gap-1 rounded-full bg-${color}/10 border border-${color}/20 px-3 py-1 text-sm`}>
      <span className={`text-${color} font-medium`}>{label}</span>
      <button
        onClick={onRemove}
        className={`text-${color}/60 hover:text-${color} transition-colors`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );

  return (
    <div className={`mb-8 ${className}`}>
      {/* Enhanced Control Bar with Integrated Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-dark/50 backdrop-blur-sm border border-stroke/30 dark:border-stroke-dark/30 relative z-10">
        {/* Left Section: Results and View Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-black dark:text-white">
              {filteredItems}
            </span>
            <span className="text-sm text-body-color dark:text-body-color-dark">
              of {totalItems} {contentType}
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-white dark:bg-gray-800 border border-stroke dark:border-stroke-dark p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-body-color hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-body-color hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center Section: Search Input */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color/60 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={`Search ${contentType === 'flows' ? 'flows' : 'articles'}...`}
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full rounded-xl border border-stroke/50 dark:border-stroke-dark/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm pl-10 pr-10 py-2.5 text-sm font-medium placeholder:text-body-color/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            {filters.searchTerm && (
              <button
                onClick={() => updateFilter('searchTerm', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-body-color/60 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Sort and Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <CustomSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => updateFilter('sortBy', value)}
            className="w-48"
          />

          {/* Sort Order Toggle */}
          <button
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2.5 rounded-xl border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              hasActiveFilters
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25'
                : 'border border-stroke dark:border-stroke-dark bg-white dark:bg-gray-800 text-body-color hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/20 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <span className="text-sm font-medium text-primary">Active filters:</span>
          
          {filters.selectedCategory !== 'all' && (
            <FilterChip
              label={`Category: ${filters.selectedCategory}`}
              onRemove={() => updateFilter('selectedCategory', 'all')}
            />
          )}
          
          {filters.selectedAuthor !== 'all' && (
            <FilterChip
              label={`Author: ${filters.selectedAuthor}`}
              onRemove={() => updateFilter('selectedAuthor', 'all')}
            />
          )}
          
          {filters.selectedYear !== 'all' && (
            <FilterChip
              label={`Year: ${filters.selectedYear}`}
              onRemove={() => updateFilter('selectedYear', 'all')}
            />
          )}
          
          {filters.selectedComplexity !== 'all' && (
            <FilterChip
              label={`Complexity: ${filters.selectedComplexity}`}
              onRemove={() => updateFilter('selectedComplexity', 'all')}
            />
          )}
          
          {filters.selectedTimeToImplement !== 'all' && (
            <FilterChip
              label={`Duration: ${filters.selectedTimeToImplement}`}
              onRemove={() => updateFilter('selectedTimeToImplement', 'all')}
            />
          )}
          
          {filters.selectedTags.map(tag => (
            <FilterChip
              key={tag}
              label={`#${tag}`}
              onRemove={() => toggleTag(tag)}
              color="blue"
            />
          ))}
          
          {filters.selectedTechnologies.map(tech => (
            <FilterChip
              key={tech}
              label={tech}
              onRemove={() => toggleTechnology(tech)}
              color="green"
            />
          ))}

          <button
            onClick={clearAllFilters}
            className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        </div>
      )}

      {/* Advanced Filter Panel */}
      {isFilterOpen && (
        <div className="rounded-2xl border border-stroke/30 dark:border-stroke-dark/30 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-dark dark:to-gray-800/50 backdrop-blur-sm p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Advanced Filters
                </h3>
                <p className="text-sm text-body-color dark:text-body-color-dark">
                  Refine your search with precision
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-body-color" />
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Categories */}
            {filterConfig.categories && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Category
                </label>
                <CustomSelect
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...filterConfig.categories.map(cat => ({
                      value: cat.value,
                      label: `${cat.label}${cat.count ? ` (${cat.count})` : ''}`
                    }))
                  ]}
                  value={filters.selectedCategory}
                  onChange={(value) => updateFilter('selectedCategory', value)}
                  searchable={true}
                />
              </div>
            )}

            {/* Authors */}
            {filterConfig.authors && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <User className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  Author
                </label>
                <CustomSelect
                  options={[
                    { value: 'all', label: 'All Authors' },
                    ...filterConfig.authors.map(author => ({
                      value: author.value,
                      label: `${author.label}${author.count ? ` (${author.count})` : ''}`
                    }))
                  ]}
                  value={filters.selectedAuthor}
                  onChange={(value) => updateFilter('selectedAuthor', value)}
                  searchable={true}
                />
              </div>
            )}

            {/* Publish Year */}
            {filterConfig.publishYears && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Calendar className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Year
                </label>
                <CustomSelect
                  options={[
                    { value: 'all', label: 'All Years' },
                    ...filterConfig.publishYears.map(year => ({
                      value: year.value,
                      label: `${year.label}${year.count ? ` (${year.count})` : ''}`
                    }))
                  ]}
                  value={filters.selectedYear}
                  onChange={(value) => updateFilter('selectedYear', value)}
                />
              </div>
            )}

            {/* Complexity (Flows only) */}
            {contentType === 'flows' && filterConfig.complexity && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Zap className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  Complexity
                </label>
                <CustomSelect
                  options={[
                    { value: 'all', label: 'All Levels' },
                    ...filterConfig.complexity.map(level => ({
                      value: level.value,
                      label: `${level.label}${level.count ? ` (${level.count})` : ''}`
                    }))
                  ]}
                  value={filters.selectedComplexity}
                  onChange={(value) => updateFilter('selectedComplexity', value)}
                />
              </div>
            )}

            {/* Time to Implement (Flows only) */}
            {contentType === 'flows' && filterConfig.timeToImplement && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Duration
                </label>
                <CustomSelect
                  options={[
                    { value: 'all', label: 'Any Duration' },
                    ...filterConfig.timeToImplement.map(time => ({
                      value: time.value,
                      label: `${time.label}${time.count ? ` (${time.count})` : ''}`
                    }))
                  ]}
                  value={filters.selectedTimeToImplement}
                  onChange={(value) => updateFilter('selectedTimeToImplement', value)}
                />
              </div>
            )}
          </div>

          {/* Tags Section */}
          {filterConfig.tags && filterConfig.tags.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                  <Tag className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <h4 className="text-sm font-semibold text-black dark:text-white">
                  Tags & Topics
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterConfig.tags.map(tag => (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      filters.selectedTags.includes(tag.value)
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 scale-105'
                        : 'bg-white/80 dark:bg-gray-800/80 text-body-color dark:text-body-color-dark hover:bg-primary/10 hover:text-primary hover:scale-105 border border-stroke/30 dark:border-stroke-dark/30'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {filters.selectedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                      #{tag.label}
                      {tag.count && (
                        <span className={`text-xs ${
                          filters.selectedTags.includes(tag.value) 
                            ? 'text-white/80' 
                            : 'text-body-color/60 dark:text-body-color-dark/60'
                        }`}>
                          ({tag.count})
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Section (Flows only) */}
          {contentType === 'flows' && filterConfig.technologies && filterConfig.technologies.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-black dark:text-white">
                  Technologies & Tools
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterConfig.technologies.map(tech => (
                  <button
                    key={tech.value}
                    onClick={() => toggleTechnology(tech.value)}
                    className={`group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      filters.selectedTechnologies.includes(tech.value)
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                        : 'bg-white/80 dark:bg-gray-800/80 text-body-color dark:text-body-color-dark hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105 border border-stroke/30 dark:border-stroke-dark/30'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {filters.selectedTechnologies.includes(tech.value) && <Check className="h-3 w-3" />}
                      {tech.label}
                      {tech.count && (
                        <span className={`text-xs ${
                          filters.selectedTechnologies.includes(tech.value) 
                            ? 'text-white/80' 
                            : 'text-body-color/60 dark:text-body-color-dark/60'
                        }`}>
                          ({tech.count})
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentFilter;
