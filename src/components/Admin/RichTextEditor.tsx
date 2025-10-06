'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { 
  Bold, Italic, List, ListOrdered, Quote, Code, 
  Heading1, Heading2, Heading3, Link as LinkIcon, ImageIcon,
  Undo, Redo, Eye, Code2, FileText
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
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
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
        class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
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
    </div>
  )
}
