'use client'

import { useState, useRef, useEffect } from 'react'
import { Save, Settings, X, Edit2, Check, ChevronDown, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface CommandDockProps {
  context: string
  onContextChange: (context: string) => void
  onSaveContext: () => void
}

export function CommandDock({ 
  context, 
  onContextChange, 
  onSaveContext 
}: CommandDockProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [contextSaved, setContextSaved] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [savedContext, setSavedContext] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // 4 lines max
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px'
    }
  }, [context])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleContextChange = (value: string) => {
    onContextChange(value)
    setContextSaved(false)
  }

  const handleSaveContext = () => {
    onSaveContext()
    setSavedContext(context)
    setContextSaved(true)
    setIsOpen(false)
  }

  const handleEditContext = () => {
    setIsOpen(true)
    setContextSaved(false)
  }

  const handleCancelEdit = () => {
    onContextChange(savedContext)
    setIsOpen(false)
    setContextSaved(true)
  }

  const clearContext = () => {
    onContextChange('')
    setSavedContext('')
    setContextSaved(false)
    setIsOpen(true)
  }

  const duplicateContext = () => {
    const duplicated = context + '\n\n--- Duplicated ---\n\n' + context
    onContextChange(duplicated)
    setContextSaved(false)
    setIsOpen(true)
  }

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#1a1a1a] relative" ref={dropdownRef}>
      {/* Header - Always Visible */}
      <div 
        className="px-4 py-3 flex items-center justify-between hover:bg-[#0a0a0a]/50 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#ff4f2b]" />
          <span className="text-[#b3b3b3] text-sm font-medium">System Context</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          variant="ghost"
          size="sm"
          className="h-[30px] w-[30px] p-0 text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
        >
          <ChevronDown className={cn("h-4 w-4 transition-all duration-200", isOpen ? "rotate-180 text-[#ff4f2b]" : "text-[#b3b3b3]")} />
        </Button>
      </div>

      {/* Dropdown Panel - Overlays CenterWorkspace */}
      <div 
        className={cn(
          "absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-[#1a1a1a] z-[9999] overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
           
           
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1 relative">
              <div className="flex items-center justify-between mb-2">
                
                {!contextSaved && context && (
                  <span className="text-[#ff4f2b] text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ff4f2b] animate-pulse" />
                    Unsaved changes
                  </span>
                )}
              </div>
              <Textarea
                ref={textareaRef}
                value={context}
                onChange={(e) => handleContextChange(e.target.value)}
                placeholder="Define system context or instructions for all models..."
                className="w-full bg-[#000000] border-[#1a1a1a] text-[#f5f5f5] placeholder-[#666666] resize-none focus:border-[#ff4f2b] focus:ring-[#ff4f2b] transition-all duration-200 min-h-[60px] max-h-[120px] rounded-lg text-sm font-mono"
                style={{
                  overflow: 'hidden'
                }}
                rows={2}
              />
            </div>
            
            <div className="flex items-start gap-2 pt-6">
              <Button
                onClick={handleSaveContext}
                disabled={!context.trim()}
                className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white px-3 py-2 h-auto text-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              {savedContext && (
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-[#1a1a1a] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] px-3 py-2 h-auto text-sm rounded-lg"
                >
                  Cancel
                </Button>
              )}
              <DropdownMenu open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#1a1a1a] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] px-3 py-2 h-auto text-sm rounded-lg"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] rounded-lg z-[10000] shadow-none">
                  <DropdownMenuItem onClick={clearContext} className="hover:bg-[#1a1a1a] rounded-md">
                    <X className="w-4 h-4 mr-2" />
                    Clear Context
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={duplicateContext} className="hover:bg-[#1a1a1a] rounded-md">
                    <Save className="w-4 h-4 mr-2" />
                    Duplicate Context
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}