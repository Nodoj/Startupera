'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFlow } from '@/lib/actions/flows'
import { Save, ArrowLeft, Plus, X, Workflow } from 'lucide-react'
import Link from 'next/link'
import RagFlowBuilder from './RagFlowBuilder'
import { Node, Edge } from 'reactflow'

interface EnhancedFlowFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function EnhancedFlowForm({ initialData, isEditing = false }: EnhancedFlowFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || [])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTech, setNewTech] = useState('')
  const [newTag, setNewTag] = useState('')
  const [flowNodes, setFlowNodes] = useState<Node[]>(initialData?.flow_diagram?.nodes || [])
  const [flowEdges, setFlowEdges] = useState<Edge[]>(initialData?.flow_diagram?.edges || [])

  const handleFlowSave = (nodes: Node[], edges: Edge[]) => {
    // Only update state, don't save to database yet
    setFlowNodes(nodes)
    setFlowEdges(edges)
    // Show a subtle indicator that changes are saved locally
    console.log('Flow diagram updated locally (not saved to database yet)')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      const flowData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        complexity: formData.get('complexity') as string,
        time_to_implement: formData.get('time_to_implement') as string,
        roi: formData.get('roi') as string,
        technologies: technologies,
        tags: tags,
        featured_image: formData.get('featured_image') as string || null,
        status: formData.get('status') as string,
        flow_diagram: {
          nodes: flowNodes,
          edges: flowEdges,
        },
      }

      await createFlow(flowData)
      router.push('/admin/flows')
      router.refresh()
    } catch (error) {
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

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/flows"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flows
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Workflow className="h-6 w-6 mr-3 text-primary" />
              Basic Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Fill in the details about your automation flow
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Title - Full Width */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Flow Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g., RAG Chatbot for Customer Support"
              />
            </div>

            {/* Description - Full Width */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                defaultValue={initialData?.description}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Describe what this flow does and its benefits..."
              />
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={initialData?.category}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select category</option>
                <option value="automation">Automation</option>
                <option value="ai-chatbot">AI Chatbot</option>
                <option value="data-processing">Data Processing</option>
                <option value="content-generation">Content Generation</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>

              {/* Complexity */}
              <div>
                <label htmlFor="complexity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Complexity *
                </label>
              <select
                id="complexity"
                name="complexity"
                required
                defaultValue={initialData?.complexity}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select complexity</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

              {/* Time to Implement */}
              <div>
                <label htmlFor="time_to_implement" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Time to Implement *
                </label>
              <select
                id="time_to_implement"
                name="time_to_implement"
                required
                defaultValue={initialData?.time_to_implement}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select time frame</option>
                <option value="1-2 days">1-2 days</option>
                <option value="3-5 days">3-5 days</option>
                <option value="1 week">1 week</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="2-3 months">2-3 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>

              {/* ROI */}
              <div>
                <label htmlFor="roi" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ROI / Business Value *
                </label>
              <input
                type="text"
                id="roi"
                name="roi"
                required
                defaultValue={initialData?.roi}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g., 300% ROI, Saves 20 hours/week"
              />
            </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={initialData?.status || 'draft'}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                </select>
              </div>

              {/* Featured Image */}
              <div>
                <label htmlFor="featured_image" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="featured_image"
                  name="featured_image"
                  defaultValue={initialData?.featured_image}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Technologies
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={newTech}
                onChange={(e) => {
                  setNewTech(e.target.value)
                  if (e.target.value && !technologies.includes(e.target.value)) {
                    setTechnologies([...technologies, e.target.value])
                    setNewTech('')
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select technology</option>
                <option value="OpenAI">OpenAI</option>
                <option value="LangChain">LangChain</option>
                <option value="Pinecone">Pinecone</option>
                <option value="Supabase">Supabase</option>
                <option value="Next.js">Next.js</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="Node.js">Node.js</option>
                <option value="TensorFlow">TensorFlow</option>
                <option value="PyTorch">PyTorch</option>
                <option value="Hugging Face">Hugging Face</option>
                <option value="Anthropic">Anthropic</option>
                <option value="Google AI">Google AI</option>
                <option value="Azure AI">Azure AI</option>
                <option value="AWS">AWS</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value)
                  if (e.target.value && !tags.includes(e.target.value)) {
                    setTags([...tags, e.target.value])
                    setNewTag('')
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select tag</option>
                <option value="automation">Automation</option>
                <option value="ai-chatbot">AI Chatbot</option>
                <option value="customer-support">Customer Support</option>
                <option value="data-processing">Data Processing</option>
                <option value="content-generation">Content Generation</option>
                <option value="analytics">Analytics</option>
                <option value="integration">Integration</option>
                <option value="workflow">Workflow</option>
                <option value="productivity">Productivity</option>
                <option value="enterprise">Enterprise</option>
                <option value="beginner-friendly">Beginner Friendly</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flow Builder Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Workflow className="h-5 w-5 mr-2 text-primary" />
              Flow Diagram Builder
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Create a visual representation of your automation flow. Add nodes and connect them to show the process flow.
            </p>
          </div>
          
          <RagFlowBuilder
            initialNodes={flowNodes}
            initialEdges={flowEdges}
            onSave={handleFlowSave}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/flows"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Flow' : 'Create Flow'}
          </button>
        </div>
      </form>
    </div>
  )
}
