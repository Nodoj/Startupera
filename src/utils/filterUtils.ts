import { Blog } from "@/types/blog";
import { Flow } from "@/types/flow";
import { FilterState, FilterConfig } from "@/components/Common/ContentFilter";

// Generic filter function for both blogs and flows
export function filterContent<T extends Blog | Flow>(
  items: T[],
  filters: FilterState,
  contentType: 'blog' | 'flows'
): T[] {
  return items.filter(item => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(searchLower);
      const matchesParagraph = item.paragraph.toLowerCase().includes(searchLower);
      const matchesAuthor = item.author.name.toLowerCase().includes(searchLower);
      const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      let matchesTech = false;
      if (contentType === 'flows' && 'technologies' in item) {
        matchesTech = (item as Flow).technologies.some(tech => 
          tech.toLowerCase().includes(searchLower)
        );
      }
      
      if (!matchesTitle && !matchesParagraph && !matchesAuthor && !matchesTags && !matchesTech) {
        return false;
      }
    }

    // Category filter
    if (filters.selectedCategory !== 'all') {
      if (contentType === 'flows' && 'category' in item) {
        if ((item as Flow).category !== filters.selectedCategory) {
          return false;
        }
      } else {
        // For blogs, use first tag as category
        if (item.tags[0] !== filters.selectedCategory) {
          return false;
        }
      }
    }

    // Tags filter
    if (filters.selectedTags.length > 0) {
      const hasMatchingTag = filters.selectedTags.some(selectedTag =>
        item.tags.includes(selectedTag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Author filter
    if (filters.selectedAuthor !== 'all') {
      if (item.author.name !== filters.selectedAuthor) {
        return false;
      }
    }

    // Year filter
    if (filters.selectedYear !== 'all') {
      if (item.publishDate !== filters.selectedYear) {
        return false;
      }
    }

    // Flow-specific filters
    if (contentType === 'flows' && 'complexity' in item) {
      const flowItem = item as Flow;
      
      // Complexity filter
      if (filters.selectedComplexity !== 'all') {
        if (flowItem.complexity !== filters.selectedComplexity) {
          return false;
        }
      }

      // Time to implement filter
      if (filters.selectedTimeToImplement !== 'all') {
        if (flowItem.timeToImplement !== filters.selectedTimeToImplement) {
          return false;
        }
      }

      // Technologies filter
      if (filters.selectedTechnologies.length > 0) {
        const hasMatchingTech = filters.selectedTechnologies.some(selectedTech =>
          flowItem.technologies.includes(selectedTech)
        );
        if (!hasMatchingTech) {
          return false;
        }
      }
    }

    return true;
  });
}

// Sort function for filtered content
export function sortContent<T extends Blog | Flow>(
  items: T[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  contentType: 'blog' | 'flows'
): T[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.author.name.localeCompare(b.author.name);
        break;
      case 'date':
        comparison = a.publishDate.localeCompare(b.publishDate);
        break;
      case 'complexity':
        if (contentType === 'flows' && 'complexity' in a && 'complexity' in b) {
          const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          const aComplexity = complexityOrder[(a as Flow).complexity as keyof typeof complexityOrder] || 0;
          const bComplexity = complexityOrder[(b as Flow).complexity as keyof typeof complexityOrder] || 0;
          comparison = aComplexity - bComplexity;
        }
        break;
      case 'timeToImplement':
        if (contentType === 'flows' && 'timeToImplement' in a && 'timeToImplement' in b) {
          // Extract number of weeks for comparison
          const extractWeeks = (timeStr: string) => {
            const match = timeStr.match(/(\d+)-?(\d+)?/);
            return match ? parseInt(match[1]) : 0;
          };
          comparison = extractWeeks((a as Flow).timeToImplement) - extractWeeks((b as Flow).timeToImplement);
        }
        break;
      case 'roi':
        if (contentType === 'flows' && 'roi' in a && 'roi' in b) {
          // Extract ROI percentage for comparison
          const extractROI = (roiStr: string) => {
            const match = roiStr.match(/(\d+)%/);
            return match ? parseInt(match[1]) : 0;
          };
          comparison = extractROI((a as Flow).roi) - extractROI((b as Flow).roi);
        }
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

// Generate filter configuration from data
export function generateFilterConfig<T extends Blog | Flow>(
  items: T[],
  contentType: 'blog' | 'flows'
): FilterConfig {
  const config: FilterConfig = {};

  // Extract unique categories
  if (contentType === 'flows') {
    const categories = [...new Set(items.map(item => (item as Flow).category))];
    config.categories = categories.map(category => ({
      value: category,
      label: category,
      count: items.filter(item => (item as Flow).category === category).length
    }));
  } else {
    // For blogs, use first tag as category
    const categories = [...new Set(items.map(item => item.tags[0]))];
    config.categories = categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      count: items.filter(item => item.tags[0] === category).length
    }));
  }

  // Extract unique tags
  const allTags = items.flatMap(item => item.tags);
  const uniqueTags = [...new Set(allTags)];
  config.tags = uniqueTags.map(tag => ({
    value: tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1),
    count: allTags.filter(t => t === tag).length
  }));

  // Extract unique authors
  const authors = [...new Set(items.map(item => item.author.name))];
  config.authors = authors.map(author => ({
    value: author,
    label: author,
    count: items.filter(item => item.author.name === author).length
  }));

  // Extract unique publish years
  const years = [...new Set(items.map(item => item.publishDate))];
  config.publishYears = years.map(year => ({
    value: year,
    label: year,
    count: items.filter(item => item.publishDate === year).length
  }));

  // Flow-specific configurations
  if (contentType === 'flows') {
    const flowItems = items as Flow[];

    // Extract unique complexities
    const complexities = [...new Set(flowItems.map(item => item.complexity))];
    config.complexity = complexities.map(complexity => ({
      value: complexity,
      label: complexity,
      count: flowItems.filter(item => item.complexity === complexity).length
    }));

    // Extract unique time to implement values
    const timeToImplement = [...new Set(flowItems.map(item => item.timeToImplement))];
    config.timeToImplement = timeToImplement.map(time => ({
      value: time,
      label: time,
      count: flowItems.filter(item => item.timeToImplement === time).length
    }));

    // Extract unique technologies
    const allTechnologies = flowItems.flatMap(item => item.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)];
    config.technologies = uniqueTechnologies.map(tech => ({
      value: tech,
      label: tech,
      count: allTechnologies.filter(t => t === tech).length
    }));
  }

  return config;
}
