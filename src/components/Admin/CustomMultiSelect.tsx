'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Search, X, Plus } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface CustomMultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchable?: boolean
  className?: string
  allowCustom?: boolean
  onAddCustom?: (value: string) => void
}

export default function CustomMultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  searchable = true,
  className = '',
  allowCustom = false,
  onAddCustom
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOptions = options.filter(opt => value.includes(opt.value))

  const filteredOptions = searchable
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    onChange(value.filter(v => v !== optionValue))
  }

  const handleAddCustom = () => {
    if (searchTerm.trim() && onAddCustom) {
      onAddCustom(searchTerm.trim())
      setSearchTerm('')
    }
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] flex items-center gap-2 px-3 py-2 text-left
          bg-white dark:bg-gray-800 
          border-2 rounded-lg
          transition-all duration-200
          ${isOpen 
            ? 'border-primary ring-2 ring-primary/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
          }
        `}
      >
        <div className="flex-1 flex flex-wrap gap-1.5">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {placeholder}
            </span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md"
              >
                {option.label}
                <X
                  className="h-3 w-3 hover:text-red-500 transition-colors cursor-pointer"
                  onClick={(e) => handleRemove(option.value, e)}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-primary rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && allowCustom && searchTerm.trim()) {
                      e.preventDefault()
                      handleAddCustom()
                    }
                  }}
                  placeholder="Search or add custom..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {allowCustom && searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  No options found
                </p>
                {allowCustom && searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add &quot;{searchTerm}&quot;
                  </button>
                )}
              </div>
            ) : (
              <>
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggle(option.value)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors
                        ${isSelected
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  )
                })}
                {allowCustom && searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-primary hover:bg-primary/10 transition-colors border-t border-gray-200 dark:border-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add &quot;{searchTerm}&quot;
                  </button>
                )}
              </>
            )}
          </div>

          {/* Selected Count */}
          {value.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
              {value.length} selected
            </div>
          )}
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
        }
        :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  )
}
