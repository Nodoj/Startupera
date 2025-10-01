'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFlow } from '@/lib/actions/flows'
import { Save, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface FlowFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function FlowForm({ initialData, isEditing = false }: FlowFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || [])
  const [newTech, setNewTech] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      const flowData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        complexity: formData.get('complexity') as string,
        time_to_implement: formData.get('time_to_implement') as string,
        roi: formData.get('roi') as string,
        technologies: technologies,
        featured_image: formData.get('featured_image') as string,
        status: formData.get('status') as string,
      }

      await createFlow(flowData)
      router.push('/admin/flows')
    } catch (error) {
      console.error('Error creating flow:', error)
      alert('Failed to create flow. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()])
      setNewTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <form action={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/flows"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Flows
            </Link>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Flow Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter flow title"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={initialData?.category}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="automation">Automation</option>
                <option value="ai-chatbot">AI Chatbot</option>
                <option value="data-processing">Data Processing</option>
                <option value="content-generation">Content Generation</option>
                <option value="business-intelligence">Business Intelligence</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initialData?.description}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe the AI automation flow and its benefits"
            />
          </div>

          {/* Complexity and Implementation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Complexity *
              </label>
              <select
                id="complexity"
                name="complexity"
                required
                defaultValue={initialData?.complexity}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select complexity</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="time_to_implement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Implementation Time
              </label>
              <input
                type="text"
                id="time_to_implement"
                name="time_to_implement"
                defaultValue={initialData?.time_to_implement}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 2-4 weeks"
              />
            </div>

            <div>
              <label htmlFor="roi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected ROI
              </label>
              <input
                type="text"
                id="roi"
                name="roi"
                defaultValue={initialData?.roi}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 300% in 6 months"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technologies
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add technology (e.g., Python, OpenAI, LangChain)"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featured_image"
              name="featured_image"
              defaultValue={initialData?.featured_image}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={initialData?.status || 'draft'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/admin/flows"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Flow' : 'Create Flow'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
