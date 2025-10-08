'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { adminTheme } from '@/styles/admin-theme'
import { Plus, Eye, Edit } from 'lucide-react'
import DeleteFlowButton from '@/components/Admin/DeleteFlowButton'
import ContentFilter from '@/components/Common/ContentFilter'
import Image from 'next/image'

interface FlowsListWithFiltersProps {
  flows: any[]
}

export default function FlowsListWithFilters({ flows }: FlowsListWithFiltersProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list') // Default to list view
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedCategory: 'all',
    selectedTags: [],
    selectedAuthor: 'all',
    selectedYear: 'all',
    selectedComplexity: 'all',
    selectedTimeToImplement: 'all',
    selectedTechnologies: [],
    sortBy: 'date',
    sortOrder: 'desc' as 'asc' | 'desc',
  })

  // Get unique categories from flows (without 'all' - ContentFilter adds it)
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(flows.map(f => f.category).filter(Boolean))]
    return categories.map(cat => ({ value: cat, label: cat }))
  }, [flows])

  // Get unique complexity levels (without 'all' - ContentFilter adds it)
  const complexityOptions = useMemo(() => {
    const levels = [...new Set(flows.map(f => f.complexity).filter(Boolean))]
    return levels.map(level => ({ value: level, label: level.charAt(0).toUpperCase() + level.slice(1) }))
  }, [flows])

  // Filter configuration for ContentFilter
  const filterConfig = {
    categories: categoryOptions,
    complexity: complexityOptions,
  }

  // Filter and sort flows
  const filteredFlows = useMemo(() => {
    let result = flows.filter(flow => {
      const matchesSearch = !filters.searchTerm || 
        flow.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        flow.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      
      const matchesCategory = filters.selectedCategory === 'all' || flow.category === filters.selectedCategory
      const matchesComplexity = filters.selectedComplexity === 'all' || flow.complexity === filters.selectedComplexity

      return matchesSearch && matchesCategory && matchesComplexity
    })

    // Sort flows
    result.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1
      return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) * order
    })

    return result
  }, [flows, filters])

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
  }, [])

  const handleViewModeChange = useCallback((newViewMode: 'grid' | 'list') => {
    setViewMode(newViewMode)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={adminTheme.typography.h1}>
            AI Automation Flows
          </h1>
          <p className={`${adminTheme.typography.body} mt-1`}>
            Manage your AI automation flow content and documentation.
          </p>
        </div>
        <Link
          href="/admin/flows/new"
          className={adminTheme.button.primary}
        >
          <Plus className="h-4 w-4 mr-2 inline-flex" />
          Create New Flow
        </Link>
      </div>

      {/* Filters */}
      <ContentFilter
        filterConfig={filterConfig}
        onFilterChange={handleFilterChange}
        onViewModeChange={handleViewModeChange}
        totalItems={flows.length}
        filteredItems={filteredFlows.length}
        contentType="flows"
        initialViewMode="list"
      />

      {/* Flows Display - Grid or Table */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlows.length === 0 ? (
            <div className="col-span-full">
              <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {flows.length === 0 ? 'No flows yet' : 'No flows match your filters'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {flows.length === 0 
                      ? 'Get started by creating your first AI automation flow.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {flows.length === 0 && (
                    <Link
                      href="/admin/flows/new"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Flow
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            filteredFlows.map((flow) => (
              <div key={flow.id} className={`${adminTheme.card.base} overflow-hidden hover:shadow-lg transition-shadow`}>
                {/* Flow Image */}
                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                  {flow.featured_image ? (
                    <Image
                      src={flow.featured_image}
                      alt={flow.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                      <span className="text-primary font-bold text-4xl">
                        {flow.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      flow.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {flow.status}
                    </span>
                  </div>
                </div>

                {/* Flow Content */}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {flow.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      flow.complexity === 'beginner' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : flow.complexity === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {flow.complexity}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                    {flow.title}
                  </h3>
                  
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {flow.description}
                  </p>

                  <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(flow.created_at).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/flows/${flow.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/flows/${flow.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                    <DeleteFlowButton flowId={flow.id} flowTitle={flow.title} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <div className={adminTheme.table.wrapper}>
        <div className="overflow-x-auto">
          <table className={adminTheme.table.base}>
            <thead className={adminTheme.table.header}>
              <tr>
                <th className={adminTheme.table.headerCell}>
                  Flow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Complexity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFlows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {flows.length === 0 ? 'No flows yet' : 'No flows match your filters'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {flows.length === 0 
                          ? 'Get started by creating your first AI automation flow.'
                          : 'Try adjusting your search or filter criteria.'
                        }
                      </p>
                      {flows.length === 0 && (
                        <Link
                          href="/admin/flows/new"
                          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Flow
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFlows.map((flow) => (
                  <tr key={flow.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative rounded-lg overflow-hidden">
                          {flow.featured_image ? (
                            <Image
                              src={flow.featured_image}
                              alt={flow.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium text-sm">
                                {flow.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {flow.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {flow.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {flow.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        flow.complexity === 'beginner' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : flow.complexity === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {flow.complexity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        flow.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {flow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(flow.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/flows/${flow.id}`}
                          className="text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                          title="View flow"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/flows/${flow.id}/edit`}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit flow"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteFlowButton flowId={flow.id} flowTitle={flow.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  )
}
