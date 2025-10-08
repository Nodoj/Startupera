'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createFlow, updateFlow } from '@/lib/actions/flows'
import { uploadFlowImage, deleteFlowImage } from '@/lib/supabase/storage'
import { adminTheme } from '@/styles/admin-theme'
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  X, 
  Upload, 
  Loader2, 
  ImageIcon, 
  FileText, 
  Edit3,
  FolderOpen,
  Tag,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import RichTextEditor from './RichTextEditor'
import CustomSelect from './CustomSelect'
import CustomMultiSelect from './CustomMultiSelect'

interface TwoColumnFlowFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function TwoColumnFlowForm({ initialData, isEditing = false }: TwoColumnFlowFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(initialData?.status || 'draft')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(initialData?.featured_image || '')
  const [isDragging, setIsDragging] = useState(false)
  
  // Gallery state - separate existing URLs from new files
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(initialData?.gallery || [])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])
  const [isGalleryDragging, setIsGalleryDragging] = useState(false)
  const [deletedGalleryUrls, setDeletedGalleryUrls] = useState<string[]>([])
  
  // Technologies state
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || [])
  const [technologyOptions, setTechnologyOptions] = useState([
    { value: 'OpenAI', label: 'OpenAI' },
    { value: 'LangChain', label: 'LangChain' },
    { value: 'Pinecone', label: 'Pinecone' },
    { value: 'Supabase', label: 'Supabase' },
    { value: 'Next.js', label: 'Next.js' },
    { value: 'React', label: 'React' },
    { value: 'Python', label: 'Python' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'TensorFlow', label: 'TensorFlow' },
    { value: 'PyTorch', label: 'PyTorch' },
    { value: 'Hugging Face', label: 'Hugging Face' },
    { value: 'Anthropic', label: 'Anthropic' },
    { value: 'Google AI', label: 'Google AI' },
    { value: 'Azure AI', label: 'Azure AI' },
    { value: 'AWS', label: 'AWS' }
  ])
  
  // Category state
  const [categories, setCategories] = useState<string[]>(initialData?.categories || [])
  const [categoryOptions, setCategoryOptions] = useState([
    { value: 'Automation', label: 'Automation' },
    { value: 'AI Chatbot', label: 'AI Chatbot' },
    { value: 'Data Processing', label: 'Data Processing' },
    { value: 'Content Generation', label: 'Content Generation' },
    { value: 'Business Intelligence', label: 'Business Intelligence' }
  ])

  // Complexity state
  const [complexity, setComplexity] = useState(initialData?.complexity || '')

  // Blog content state
  const [content, setContent] = useState(initialData?.content || '')

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

  // Gallery handlers
  const handleGallerySelect = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const newPreviews: string[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        return
      }

      validFiles.push(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === validFiles.length) {
          setNewGalleryPreviews([...newGalleryPreviews, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setNewGalleryFiles([...newGalleryFiles, ...validFiles])
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleGallerySelect(e.target.files)
  }

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsGalleryDragging(true)
  }

  const handleGalleryDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsGalleryDragging(false)
  }

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsGalleryDragging(false)
    handleGallerySelect(e.dataTransfer.files)
  }

  const removeGalleryImage = async (index: number, isExisting: boolean) => {
    if (isExisting) {
      // Mark existing URL for deletion
      const urlToDelete = existingGalleryUrls[index]
      setDeletedGalleryUrls([...deletedGalleryUrls, urlToDelete])
      setExistingGalleryUrls(existingGalleryUrls.filter((_, i) => i !== index))
    } else {
      // Remove new file from preview
      const adjustedIndex = index - existingGalleryUrls.length
      setNewGalleryPreviews(newGalleryPreviews.filter((_, i) => i !== adjustedIndex))
      setNewGalleryFiles(newGalleryFiles.filter((_, i) => i !== adjustedIndex))
    }
  }

  // Handle adding custom technology
  const handleAddCustomTech = (value: string) => {
    const newOption = { value, label: value }
    setTechnologyOptions([...technologyOptions, newOption])
    setTechnologies([...technologies, value])
  }

  // Handle adding custom category
  const handleAddCustomCategory = (value: string) => {
    const newOption = { value, label: value }
    setCategoryOptions([...categoryOptions, newOption])
    setCategories([...categories, value])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Delete marked gallery images from storage first
      if (deletedGalleryUrls.length > 0) {
        for (const url of deletedGalleryUrls) {
          await deleteFlowImage(url)
        }
      }
      
      // Upload featured image if new file selected
      let uploadedImageUrl = initialData?.featured_image || null
      if (imageFile) {
        uploadedImageUrl = await uploadFlowImage(imageFile)
        if (!uploadedImageUrl) {
          alert('Failed to upload featured image. Please try again.')
          setIsSubmitting(false)
          return
        }
      }

      // Upload new gallery images only (not existing ones)
      const uploadedGalleryUrls: string[] = [...existingGalleryUrls]
      if (newGalleryFiles.length > 0) {
        for (const file of newGalleryFiles) {
          const url = await uploadFlowImage(file)
          if (url) {
            uploadedGalleryUrls.push(url)
          } else {
            console.error('Failed to upload gallery image:', file.name)
          }
        }
      }
      
      const flowData = {
        title: formData.get('title') as string,
        content: content,
        category: categories[0] || '', // Use first category for backward compatibility
        categories: categories, // Store all categories
        complexity: formData.get('complexity') as string,
        time_to_implement: formData.get('time_to_implement') as string,
        roi: formData.get('roi') as string,
        technologies: technologies,
        featured_image: uploadedImageUrl,
        gallery: uploadedGalleryUrls, // Gallery images (existing + newly uploaded)
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
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
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
        <div className="flex flex-wrap -mx-4">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="w-full px-4 lg:w-8/12 xl:w-9/12">
            <div className="space-y-6">
            
            {/* 1. Images (Featured + Gallery) */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <h3 className={`${adminTheme.typography.h3}`}>Images</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Image Column */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Featured Image *
                  </h4>
                  
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
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
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all h-64 flex items-center justify-center ${
                        isDragging
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:border-primary'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className={`h-12 w-12 mb-3 transition-colors ${
                          isDragging ? 'text-primary' : 'text-gray-400'
                        }`} />
                        <p className="text-gray-600 dark:text-gray-400 mb-1 font-medium text-sm">
                          {isDragging ? 'Drop here' : 'Upload featured image'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          PNG, JPG, GIF • Max 5MB
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

                {/* Gallery Images Column */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Gallery Images (Optional)
                  </h4>
                  
                  {/* Gallery Grid - Show existing + new images */}
                  {(existingGalleryUrls.length > 0 || newGalleryPreviews.length > 0) && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Existing gallery images */}
                      {existingGalleryUrls.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <div className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <Image
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index, true)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {/* New gallery images (not yet uploaded) */}
                      {newGalleryPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <div className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-blue-300 dark:border-blue-600">
                            <Image
                              src={preview}
                              alt={`New ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {/* New badge */}
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                              NEW
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(existingGalleryUrls.length + index, false)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    onDragOver={handleGalleryDragOver}
                    onDragLeave={handleGalleryDragLeave}
                    onDrop={handleGalleryDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      (existingGalleryUrls.length + newGalleryPreviews.length) > 0 ? 'h-auto' : 'h-64 flex items-center justify-center'
                    } ${
                      isGalleryDragging
                        ? 'border-primary bg-primary/10 scale-105'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:border-primary'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Plus className={`h-10 w-10 mb-2 transition-colors ${
                        isGalleryDragging ? 'text-primary' : 'text-gray-400'
                      }`} />
                      <p className="text-gray-600 dark:text-gray-400 mb-1 font-medium text-sm">
                        {isGalleryDragging ? 'Drop here' : 'Add gallery images'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Multiple files • Max 5MB each
                      </p>
                    </div>
                  </div>

                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <strong>Featured image</strong> appears as the main hero image. <strong>Gallery images</strong> will be displayed in a carousel below.
              </p>
            </div>

            {/* 2. Flow Title */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
              <label htmlFor="title" className={`${adminTheme.typography.label} mb-3 flex items-center gap-2`}>
                <FileText className="h-4 w-4 text-primary" />
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

            {/* 2. Main Content (Rich Text Editor) */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg}`}>
              <RichTextEditor
                content={content}
                onChange={setContent}
                label="Main Content"
                placeholder="Write the detailed content for this flow. Use headings, lists, and formatting to create engaging content..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This is the main blog-style content that will appear in the overview section.
              </p>
            </div>
            </div>
          </div>

          {/* RIGHT COLUMN (1/3 width) - Sticky Sidebar */}
          <div className="w-full px-4 lg:w-4/12 xl:w-3/12">
            <aside className="space-y-6 lg:sticky lg:top-24">
            
            {/* Publish Status - Colored Buttons */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="h-4 w-4 text-primary" />
                <h3 className={`${adminTheme.typography.h4}`}>Publish Status</h3>
              </div>
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

            {/* Categories & Technologies */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <div className="space-y-4">
                <div>
                  <label className={`${adminTheme.typography.label} mb-3 flex items-center gap-2`}>
                    <FolderOpen className="h-4 w-4 text-primary" />
                    Categories
                  </label>
                  <CustomMultiSelect
                    options={categoryOptions}
                    value={categories}
                    onChange={setCategories}
                    placeholder="Select categories"
                    searchable={true}
                    allowCustom={true}
                    onAddCustom={handleAddCustomCategory}
                  />
                </div>

                <div>
                  <label className={`${adminTheme.typography.label} mb-3 flex items-center gap-2`}>
                    <Tag className="h-4 w-4 text-primary" />
                    Technologies
                  </label>
                  <CustomMultiSelect
                    options={technologyOptions}
                    value={technologies}
                    onChange={setTechnologies}
                    placeholder="Select technologies"
                    searchable={true}
                    allowCustom={true}
                    onAddCustom={handleAddCustomTech}
                  />
                </div>
              </div>
            </div>

            {/* Complexity / Time to Implement / Expected ROI */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <div className="space-y-4">
                <div>
                  <label className={`${adminTheme.typography.label} mb-2 flex items-center gap-2`}>
                    <Zap className="h-4 w-4 text-primary" />
                    Complexity *
                  </label>
                  <CustomSelect
                    options={[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' }
                    ]}
                    value={complexity}
                    onChange={setComplexity}
                    placeholder="Select complexity level"
                    required={true}
                  />
                  <input type="hidden" name="complexity" value={complexity} required />
                </div>

                <div>
                  <label htmlFor="time_to_implement" className={`${adminTheme.typography.label} mb-2 flex items-center gap-2`}>
                    <Clock className="h-4 w-4 text-primary" />
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

                <div>
                  <label htmlFor="roi" className={`${adminTheme.typography.label} mb-2 flex items-center gap-2`}>
                    <TrendingUp className="h-4 w-4 text-primary" />
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
              </div>
            </div>

            {/* Submit Button - In Sidebar */}
            <div className={`${adminTheme.card.base} ${adminTheme.card.padding.md}`}>
              <button
                type="submit"
                disabled={isSubmitting || categories.length === 0}
                className={`w-full inline-flex items-center justify-center px-6 py-3 ${adminTheme.button.primary} text-base disabled:opacity-50 disabled:cursor-not-allowed`}
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
              {categories.length === 0 && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                  Please select at least one category
                </p>
              )}
            </div>
            </aside>
          </div>
        </div>
      </form>
    </>
  )
}
