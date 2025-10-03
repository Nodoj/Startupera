'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createFlow, updateFlow } from '@/lib/actions/flows'
import { uploadFlowImage } from '@/lib/supabase/storage'
import { adminTheme } from '@/styles/admin-theme'
import { Save, ArrowLeft, Plus, X, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface TwoColumnFlowFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function TwoColumnFlowForm({ initialData, isEditing = false }: TwoColumnFlowFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(initialData?.status || 'draft')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(initialData?.featured_image || '')
  const [isDragging, setIsDragging] = useState(false)
  
  // Technologies state
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || [])
  const [customTech, setCustomTech] = useState('')
  const [showCustomTech, setShowCustomTech] = useState(false)
  
  // Category state (now multi-select like technologies)
  const [categories, setCategories] = useState<string[]>(initialData?.categories || [])
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const predefinedTechnologies = [
    'OpenAI', 'LangChain', 'Pinecone', 'Supabase', 'Next.js', 'React',
    'Python', 'Node.js', 'TensorFlow', 'PyTorch', 'Hugging Face',
    'Anthropic', 'Google AI', 'Azure AI', 'AWS'
  ]

  const predefinedCategories = [
    'Automation', 'AI Chatbot', 'Data Processing', 
    'Content Generation', 'Business Intelligence'
  ]

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Store file and create preview
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addTechnology = (tech: string) => {
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech])
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const addCategory = (cat: string) => {
    if (cat && !categories.includes(cat)) {
      setCategories([...categories, cat])
    }
  }

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Upload image only when submitting the form
      let uploadedImageUrl = initialData?.featured_image || null
      if (imageFile) {
        uploadedImageUrl = await uploadFlowImage(imageFile)
        if (!uploadedImageUrl) {
          alert('Failed to upload image. Please try again.')
          setIsSubmitting(false)
          return
        }
      }
      
      const flowData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: categories[0] || '', // Use first category for backward compatibility
        categories: categories, // Store all categories
        complexity: formData.get('complexity') as string,
        time_to_implement: formData.get('time_to_implement') as string,
        roi: formData.get('roi') as string,
        technologies: technologies,
        featured_image: uploadedImageUrl,
        status: status,
      }

      if (isEditing && initialData?.id) {
        await updateFlow(initialData.id, flowData)
      } else {
        await createFlow(flowData)
      }
      
      router.push('/admin/flows')
      router.refresh()
    } catch (error) {
      console.error('Error creating flow:', error)
      alert('Failed to create flow. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

      <form onSubmit={handleSubmit}>
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Image Upload */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
              <h3 className={`${adminTheme.typography.h3} mb-4`}>Featured Image</h3>
              
              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:border-primary'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Upload className={`h-16 w-16 mb-4 transition-colors ${
                      isDragging ? 'text-primary' : 'text-gray-400'
                    }`} />
                    <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium text-lg">
                      {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* 2. Flow Title */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
              <label htmlFor="title" className={`${adminTheme.typography.label} mb-3 block`}>
                Flow Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                className={adminTheme.input.base}
                placeholder="e.g., RAG Chatbot for Customer Support"
              />
            </div>

            {/* 3. Description */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
              <label htmlFor="description" className={`${adminTheme.typography.label} mb-3 block`}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                defaultValue={initialData?.description}
                className={`${adminTheme.input.base} resize-none`}
                placeholder="Describe what this flow does, its benefits, and use cases..."
              />
            </div>
          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-6">
            
            {/* Publish Status - Colored Buttons */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md} sticky top-6`}>
              <h3 className={`${adminTheme.typography.h4} mb-4`}>Publish Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    status === 'draft'
                      ? 'bg-yellow-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    status === 'published'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Categories - Multi-select */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <label className={`${adminTheme.typography.label} mb-3 block`}>
                Categories
              </label>
              
              <select
                value={showCustomCategory ? 'custom' : ''}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setShowCustomCategory(true)
                  } else if (e.target.value) {
                    addCategory(e.target.value)
                    e.target.value = ''
                  }
                }}
                className={`${adminTheme.input.base} mb-3`}
              >
                <option value="">Add category</option>
                {predefinedCategories.filter(c => !categories.includes(c)).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">+ Add Custom</option>
              </select>

              {showCustomCategory && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (customCategory.trim()) {
                          addCategory(customCategory.trim())
                          setCustomCategory('')
                          setShowCustomCategory(false)
                        }
                      }
                    }}
                    placeholder="Enter category"
                    className={`flex-1 ${adminTheme.input.base}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customCategory.trim()) {
                        addCategory(customCategory.trim())
                        setCustomCategory('')
                        setShowCustomCategory(false)
                      }
                    }}
                    className={adminTheme.button.primary}
                  >
                    Add
                  </button>
                </div>
              )}

              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Complexity / Time to Implement */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="complexity" className={`${adminTheme.typography.label} mb-2 block`}>
                    Complexity *
                  </label>
                  <select
                    id="complexity"
                    name="complexity"
                    required
                    defaultValue={initialData?.complexity}
                    className={adminTheme.input.base}
                  >
                    <option value="">Select</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="time_to_implement" className={`${adminTheme.typography.label} mb-2 block`}>
                    Time to Implement
                  </label>
                  <input
                    type="text"
                    id="time_to_implement"
                    name="time_to_implement"
                    defaultValue={initialData?.time_to_implement}
                    className={adminTheme.input.base}
                    placeholder="e.g., 2-4 weeks"
                  />
                </div>
              </div>
            </div>

            {/* Expected ROI */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <label htmlFor="roi" className={`${adminTheme.typography.label} mb-3 block`}>
                Expected ROI
              </label>
              <input
                type="text"
                id="roi"
                name="roi"
                defaultValue={initialData?.roi}
                className={adminTheme.input.base}
                placeholder="e.g., 300% ROI, Saves 20 hours/week"
              />
            </div>

            {/* Technologies */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <label className={`${adminTheme.typography.label} mb-3 block`}>
                Technologies
              </label>
              
              <select
                value={showCustomTech ? 'custom' : ''}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setShowCustomTech(true)
                  } else if (e.target.value) {
                    addTechnology(e.target.value)
                    e.target.value = ''
                  }
                }}
                className={`${adminTheme.input.base} mb-3`}
              >
                <option value="">Add technology</option>
                {predefinedTechnologies.filter(t => !technologies.includes(t)).map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
                <option value="custom">+ Add Custom</option>
              </select>

              {showCustomTech && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (customTech.trim()) {
                          addTechnology(customTech.trim())
                          setCustomTech('')
                          setShowCustomTech(false)
                        }
                      }
                    }}
                    placeholder="Enter technology"
                    className={`flex-1 ${adminTheme.input.base}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTech.trim()) {
                        addTechnology(customTech.trim())
                        setCustomTech('')
                        setShowCustomTech(false)
                      }
                    }}
                    className={adminTheme.button.primary}
                  >
                    Add
                  </button>
                </div>
              )}

              {technologies.length > 0 && (
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
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button - Bottom Center */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isSubmitting || categories.length === 0}
            className={`inline-flex items-center px-8 py-3 ${adminTheme.button.primary} text-base disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEditing ? 'Update Flow' : 'Create Flow'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
