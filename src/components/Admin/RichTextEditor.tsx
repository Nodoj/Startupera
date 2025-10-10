'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import HardBreak from '@tiptap/extension-hard-break'
import { uploadContentImage, deleteFlowImage } from '@/lib/supabase/storage'
import { 
  Bold, Italic, List, ListOrdered, Quote, Code, 
  Heading1, Heading2, Heading3, Link as LinkIcon, ImageIcon,
  Undo, Redo, Eye, Code2, FileText, X, Upload, Loader2
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...',
  label,
  required = false
}: RichTextEditorProps) {
  
  const [mode, setMode] = useState<'visual' | 'markdown' | 'html'>('visual')
  const [rawContent, setRawContent] = useState(content)
  const [mounted, setMounted] = useState(false)
  
  // Modal states
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Define removeImage function before editor initialization
  const removeImage = async (imageSrc: string, editorInstance: any) => {
    if (!confirm('Are you sure you want to remove this image?')) return
    
    try {
      // If it's a Supabase storage URL, delete from storage
      if (imageSrc.includes('/flow-images/')) {
        await deleteFlowImage(imageSrc)
      }
      
      // Remove from editor
      const { state } = editorInstance
      const { doc } = state
      let imagePos: number | null = null
      
      doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'image' && node.attrs.src === imageSrc) {
          imagePos = pos
          return false
        }
      })
      
      if (imagePos !== null) {
        editorInstance.chain().focus().deleteRange({ from: imagePos, to: imagePos + 1 }).run()
      }
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Failed to remove image')
    }
  }
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        hardBreak: false, // Disable default hardBreak to use custom one
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-900 dark:bg-black text-white p-4 rounded-lg font-mono text-sm',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'text-primary bg-primary/10 px-1 py-0.5 rounded font-mono text-sm',
          },
        },
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            // Shift+Enter creates a line break within the same block
            'Shift-Enter': () => this.editor.commands.setHardBreak(),
          }
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: 'max-w-full h-auto rounded-lg my-4',
            },
          }
        },
        addNodeView() {
          return ({ node, editor: editorInstance }) => {
            const container = document.createElement('div')
            container.className = 'relative inline-block group my-4'
            
            const img = document.createElement('img')
            img.src = node.attrs.src
            img.alt = node.attrs.alt || ''
            img.className = 'max-w-full h-auto rounded-lg'
            
            const deleteBtn = document.createElement('button')
            deleteBtn.innerHTML = '×'
            deleteBtn.className = 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600 text-lg font-bold'
            deleteBtn.onclick = (e) => {
              e.preventDefault()
              removeImage(node.attrs.src, editorInstance)
            }
            
            container.appendChild(img)
            container.appendChild(deleteBtn)
            
            return {
              dom: container,
            }
          }
        },
      }),
    ],
    content,
    immediatelyRender: false, // Fix SSR hydration issue
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-3.5 prose-h1:mt-5 prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-4 prose-h3:text-xl prose-h3:font-bold prose-h3:mb-2 prose-h3:mt-3.5 prose-headings:text-black dark:prose-headings:text-white prose-p:text-body-color dark:prose-p:text-body-color-dark prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-black dark:prose-strong:text-white prose-ul:text-body-color dark:prose-ul:text-body-color-dark prose-ol:text-body-color dark:prose-ol:text-body-color-dark prose-li:marker:text-primary prose-blockquote:border-l-primary prose-blockquote:text-body-color dark:prose-blockquote:text-body-color-dark prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-img:rounded-lg',
      },
      handleKeyDown: (view, event) => {
        // Enter key exits headings and creates a new paragraph
        if (event.key === 'Enter' && !event.shiftKey) {
          const { state } = view
          const { $from } = state.selection
          
          // Check if we're in a heading
          if ($from.parent.type.name === 'heading') {
            event.preventDefault()
            editor?.chain().focus().insertContentAt($from.after(), { type: 'paragraph' }).run()
            return true
          }
        }
        return false
      },
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    // Get selected text if any
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, '')
    setLinkText(selectedText)
    setLinkUrl('')
    setShowLinkModal(true)
  }

  const insertLink = () => {
    if (!linkUrl || !linkText) return
    
    // Ensure URL is absolute and has protocol
    let finalUrl = linkUrl.trim()
    
    // If URL doesn't start with http:// or https://, add https://
    if (!finalUrl.match(/^https?:\/\//i)) {
      finalUrl = `https://${finalUrl}`
    }
    
    // Insert link with text
    editor.chain().focus().insertContent(`<a href="${finalUrl}">${linkText}</a>`).run()
    
    setShowLinkModal(false)
    setLinkUrl('')
    setLinkText('')
  }

  const addImage = () => {
    setImageUrl('')
    setImageAlt('')
    setImageFile(null)
    setImageMode('url')
    setShowImageModal(true)
  }

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert('Please select an image file')
      return
    }
    
    setIsUploading(true)
    try {
      // Upload to content-images directory in storage
      const url = await uploadContentImage(imageFile)
      if (url) {
        editor.chain().focus().setImage({ src: url, alt: imageAlt || 'Content image' }).run()
        setShowImageModal(false)
        setImageFile(null)
        setImageUrl('')
        setImageAlt('')
        setImageMode('url')
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const insertImageUrl = () => {
    if (!imageUrl || !imageUrl.trim()) {
      alert('Please enter a valid image URL')
      return
    }
    
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || 'Image' }).run()
    setShowImageModal(false)
    setImageUrl('')
    setImageAlt('')
    setImageMode('url')
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

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setImageFile(file)
        setImageUrl('') // Clear URL when file is selected
      } else {
        alert('Please drop an image file')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB')
          return
        }
        setImageFile(file)
        setImageUrl('') // Clear URL when file is selected
      } else {
        alert('Please select an image file')
      }
    }
  }

  const handleModeChange = (newMode: 'visual' | 'markdown' | 'html') => {
    if (newMode === mode) return

    if (mode === 'visual' && editor) {
      // Save current HTML when leaving visual mode
      setRawContent(editor.getHTML())
    } else if (newMode === 'visual' && editor) {
      // Load content into editor when entering visual mode
      editor.commands.setContent(rawContent)
    }

    setMode(newMode)
  }

  const handleRawContentChange = (value: string) => {
    setRawContent(value)
    onChange(value)
  }

  // Helper function to convert Markdown to HTML (basic)
  const markdownToHtml = (md: string): string => {
    let html = md
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    // Line breaks
    html = html.replace(/\n/gim, '<br>')
    return html
  }

  const applyMarkdown = () => {
    const html = markdownToHtml(rawContent)
    onChange(html)
    if (editor) {
      editor.commands.setContent(html)
    }
    setMode('visual')
  }

  const applyHtml = () => {
    onChange(rawContent)
    if (editor) {
      editor.commands.setContent(rawContent)
    }
    setMode('visual')
  }

  const MenuButton = ({ onClick, active, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        active ? 'bg-gray-200 dark:bg-gray-600' : ''
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Custom heading styles for editor */}
      <style jsx global>{`
        .ProseMirror h1 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          margin-bottom: 0.875rem !important;
          margin-top: 1.25rem !important;
          line-height: 1.3 !important;
        }
        .ProseMirror h2 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          margin-bottom: 0.75rem !important;
          margin-top: 1rem !important;
          line-height: 1.4 !important;
        }
        .ProseMirror h3 {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          margin-bottom: 0.5rem !important;
          margin-top: 0.875rem !important;
          line-height: 1.5 !important;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          padding-left: 0 !important;
          margin-left: 1.5rem !important;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem !important;
          padding-left: 0.25rem !important;
        }
        .ProseMirror ul {
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #4A6CF7 !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          margin: 1rem 0 !important;
        }
        .ProseMirror code {
          background-color: rgba(74, 108, 247, 0.1) !important;
          color: #4A6CF7 !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.875rem !important;
        }
        .ProseMirror pre {
          background-color: #1a1a1a !important;
          color: #fff !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1rem 0 !important;
        }
        .ProseMirror pre code {
          background-color: transparent !important;
          color: inherit !important;
          padding: 0 !important;
        }
        .ProseMirror img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
        }
        .ProseMirror a {
          color: #4A6CF7 !important;
          text-decoration: underline !important;
        }
        .ProseMirror a:hover {
          opacity: 0.8 !important;
        }
      `}</style>
      
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* Mode Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => handleModeChange('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'visual'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Eye className="h-4 w-4" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('markdown')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'markdown'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            Markdown
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('html')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'html'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Code2 className="h-4 w-4" />
            HTML
          </button>
        </div>

        {/* Toolbar - Only show in visual mode */}
        {mode === 'visual' && (
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </MenuButton>
          
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
          >
            <Heading3 className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
          >
            <Quote className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
          >
            <Code className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <MenuButton onClick={addLink}>
            <LinkIcon className="h-4 w-4" />
          </MenuButton>

          <MenuButton onClick={addImage}>
            <ImageIcon className="h-4 w-4" />
          </MenuButton>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <MenuButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="h-4 w-4" />
          </MenuButton>

          <MenuButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="h-4 w-4" />
          </MenuButton>
          </div>
        )}

        {/* Content Area */}
        {mode === 'visual' ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="relative">
            <textarea
              value={rawContent}
              onChange={(e) => handleRawContentChange(e.target.value)}
              className="w-full min-h-[300px] p-4 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
              placeholder={mode === 'markdown' ? '# Heading\n\n**Bold text** and *italic text*\n\n- List item\n- Another item' : '<h1>Heading</h1>\n<p>Paragraph text</p>\n<ul>\n  <li>List item</li>\n</ul>'}
            />
            <div className="flex justify-end gap-2 p-3 border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              {mode === 'markdown' && (
                <button
                  type="button"
                  onClick={applyMarkdown}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Convert to HTML & Apply
                </button>
              )}
              {mode === 'html' && (
                <button
                  type="button"
                  onClick={applyHtml}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Apply HTML
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Link Modal - Rendered outside form using Portal */}
      {mounted && showLinkModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Insert Link</h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link Text *
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL *
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="example.com or https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter full URL. https:// will be added automatically if missing.
                </p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  disabled={!linkUrl || !linkText}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Image Modal - Rendered outside form using Portal */}
      {mounted && showImageModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Insert Image</h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Tab-like selection */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    imageMode === 'url'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    imageMode === 'upload'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Upload
                </button>
              </div>
              
              {imageMode === 'url' ? (
                // URL Input
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Describe the image"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowImageModal(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={insertImageUrl}
                      disabled={!imageUrl || !imageUrl.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Insert Image
                    </button>
                  </div>
                </>
              ) : (
                // File Upload
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Image *
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-md cursor-pointer transition-all ${
                        isDragging
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                        {imageFile ? (
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {imageFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Drop image here or click to browse
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Max 5MB. Supported: JPG, PNG, GIF, WebP
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Describe the image"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowImageModal(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!imageFile || isUploading}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload & Insert'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
