'use client'

import { useState, useRef, useEffect } from 'react'
import { Timer, Coins, Copy, Diff, Download, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ModelResponse {
  id: string
  version: string
  content: string
  timestamp: string
  latency: number
  tokens: number
}

interface ModelColumnProps {
  id: string
  name: string
  color: string
  responses: ModelResponse[]
  activeVersion: string
  onVersionChange: (version: string) => void
  onAddVersion: () => void
  onOpenDiff: () => void
  width: string
}

export function ModelColumn({
  id,
  name,
  color,
  responses,
  activeVersion,
  onVersionChange,
  onAddVersion,
  onOpenDiff,
  width
}: ModelColumnProps) {
  const activeResponse = responses.find(r => r.version === activeVersion) || responses[0]
  const displayLatency = activeResponse?.latency || 0
  const displayTokens = activeResponse?.tokens || 0
  const columnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const selectionStartRef = useRef<{ column: string; timestamp: number } | null>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // Prevent selection from crossing column boundaries
  useEffect(() => {
    const column = columnRef.current
    const content = contentRef.current
    if (!column || !content) return

    const handleMouseDown = (e: MouseEvent) => {
      // Only track if clicking in the content area
      if (content.contains(e.target as Node)) {
        selectionStartRef.current = {
          column: id,
          timestamp: Date.now()
        }
      }
    }

    const handleSelectStart = (e: Event) => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const startContainer = range.startContainer
      const endContainer = range.endContainer

      // Check if selection starts in this column
      const startsInThisColumn = column.contains(startContainer.nodeType === Node.TEXT_NODE 
        ? startContainer.parentElement 
        : startContainer as Node)

      // Check if selection ends in this column
      const endsInThisColumn = column.contains(endContainer.nodeType === Node.TEXT_NODE 
        ? endContainer.parentElement 
        : endContainer as Node)

      // If selection crosses column boundaries, prevent it
      if (startsInThisColumn && !endsInThisColumn) {
        e.preventDefault()
        selection.removeAllRanges()
      } else if (!startsInThisColumn && endsInThisColumn) {
        e.preventDefault()
        selection.removeAllRanges()
      }
    }

    const handleMouseUp = () => {
      // Small delay to check selection after mouse up
      setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) {
          selectionStartRef.current = null
          return
        }

        const range = selection.getRangeAt(0)
        const startContainer = range.startContainer
        const endContainer = range.endContainer

        // Get the column elements
        const startColumn = (startContainer.nodeType === Node.TEXT_NODE 
          ? startContainer.parentElement?.closest('[data-model-column]')
          : (startContainer as Element)?.closest('[data-model-column]')) as HTMLElement

        const endColumn = (endContainer.nodeType === Node.TEXT_NODE 
          ? endContainer.parentElement?.closest('[data-model-column]')
          : (endContainer as Element)?.closest('[data-model-column]')) as HTMLElement

        // If selection spans multiple columns, clear it
        if (startColumn && endColumn && startColumn !== endColumn) {
          selection.removeAllRanges()
        }

        selectionStartRef.current = null
      }, 10)
    }

    column.addEventListener('mousedown', handleMouseDown)
    column.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      column.removeEventListener('mousedown', handleMouseDown)
      column.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [id])

  // Handle scroll to bottom button visibility
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = content
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10 // 10px threshold
      setShowScrollToBottom(!isAtBottom)
    }

    // Check initial state
    checkScrollPosition()

    // Listen to scroll events
    content.addEventListener('scroll', checkScrollPosition)
    
    // Also check when content changes
    const resizeObserver = new ResizeObserver(checkScrollPosition)
    resizeObserver.observe(content)

    return () => {
      content.removeEventListener('scroll', checkScrollPosition)
      resizeObserver.disconnect()
    }
  }, [activeResponse])

  const handleScrollToBottom = () => {
    const content = contentRef.current
    if (content) {
      content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Convert hex color to rgba for subtle glow
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Neomorphism color theory: Calculate light and shadow from background
  // For dark theme: light = slightly lighter, shadow = darker
  // Background: #0a0a0a (very dark)
  const neomorphicLight = 'rgba(20, 20, 20, 0.3)' // Slightly lighter than background
  const neomorphicShadow = 'rgba(0, 0, 0, 0.3)' // Darker shadow
  const neomorphicInsetLight = 'rgba(15, 15, 15, 0.2)' // Subtle inner highlight
  const neomorphicInsetShadow = 'rgba(5, 5, 5, 0.3)' // Inner shadow

  // Subtle color accent for neomorphic style (very low opacity)
  const colorAccent = hexToRgba(color, 0.05)
  const colorAccentInset = hexToRgba(color, 0.02)

  return (
    <div
      ref={columnRef}
      data-model-column={id}
      className="flex-shrink-0 flex flex-col relative rounded-lg overflow-hidden"
      style={{
        width,
        userSelect: 'none',
        backgroundColor: '#0a0a0a',
        border: 'none',
        boxShadow: `
          /* Outer neomorphic shadows - light source from top-left */
          2px 2px 4px ${neomorphicShadow},
          -2px -2px 4px ${neomorphicLight},
          /* Inner neomorphic shadows */
          inset 2px 2px 4px ${neomorphicInsetShadow},
          inset -2px -2px 4px ${neomorphicInsetLight},
          /* Subtle color accent glow */
          2px 4px 8px 0 ${colorAccent},
          inset 0 0 12px 0 ${colorAccentInset}
        `
      }}
    >
      {/* Header */}
      <div 
        className="bg-[#111111] p-4 border-b-2 relative"
        style={{ borderColor: color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <h3 className="text-[#f5f5f5] font-medium text-sm">{name}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>{displayLatency.toFixed(1)}s</span>
            </div>
            <span className="text-[#666666]">·</span>
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3" />
              <span>{displayTokens} tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Version Tabs */}
      <div 
        className="bg-[#0a0a0a] px-4 py-2 border-b border-[#1a1a1a] relative"
      >
        <div className="flex gap-2 flex-wrap">
          {responses.map((response) => (
            <button
              key={response.id}
              onClick={() => onVersionChange(response.version)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                activeVersion === response.version
                  ? 'bg-[#ff4f2b] text-white'
                  : 'bg-[#1a1a1a] text-[#b3b3b3] hover:text-[#f5f5f5]'
              }`}
              style={{
                backgroundColor: activeVersion === response.version ? color : undefined
              }}
            >
              {response.version}
            </button>
          ))}
          <button
            onClick={onAddVersion}
            className="px-3 py-1 rounded-full text-xs bg-[#2a2a2a] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#3a3a3a] transition-all"
          >
            + New
          </button>
        </div>
      </div>

      {/* Response Body */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          userSelect: 'text'
        }}
      >
        {activeResponse && (
          <div className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-[#f5f5f5] whitespace-pre-wrap font-mono text-sm leading-relaxed"
                style={{
                  userSelect: 'text'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: activeResponse.content
                    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-[#f5f5f5] mb-3">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-[#f5f5f5] mb-2">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-base font-medium text-[#f5f5f5] mb-2">$1</h3>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong class="text-[#f5f5f5]">$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em class="text-[#b3b3b3]">$1</em>')
                    .replace(/^- (.*$)/gim, '<li class="text-[#b3b3b3] ml-4">$1</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li class="text-[#b3b3b3] ml-4 list-decimal">$1</li>')
                    .replace(/`([^`]+)`/gim, '<code class="bg-[#1a1a1a] text-[#ff4f2b] px-1 py-0.5 rounded text-xs">$1</code>')
                    .replace(/\n\n/gim, '</p><p class="mb-4">')
                    .replace(/^(.)/gim, '<p class="mb-4">$1')
                }}
              />
            </div>

            {/* Inline Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-[#1a1a1a]">
              <Button variant="ghost" size="sm" className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] text-sm">
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] text-sm"
                onClick={onOpenDiff}
              >
                <Diff className="w-3 h-3 mr-1" />
                Diff
              </Button>
              <Button variant="ghost" size="sm" className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] text-sm">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button - Positioned at bottom right of column */}
      {showScrollToBottom && (
        <button
          onClick={handleScrollToBottom}
          className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-md bg-[#2a2a2a] border border-[#3a3a3a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] transition-all duration-200 flex items-center justify-center shadow-lg"
          style={{
            opacity: showScrollToBottom ? 1 : 0,
            pointerEvents: showScrollToBottom ? 'auto' : 'none'
          }}
        >
          <ChevronDown className="w-4 h-4 text-[#b3b3b3]" />
        </button>
      )}
    </div>
  )
}

