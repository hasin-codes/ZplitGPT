'use client'

import { useState, useRef, useEffect } from 'react'
import { Timer, Coins, Copy, Diff, Download, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AdvanceControls } from './AdvanceControls'
import { cn } from '@/lib/utils'

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
  className?: string
  contentPaddingBottom?: string | number
  style?: React.CSSProperties
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
  width,
  className,
  contentPaddingBottom,
  style
}: ModelColumnProps) {
  const activeResponse = responses.find(r => r.version === activeVersion) || responses[0]
  const displayLatency = activeResponse?.latency || 0
  const displayTokens = activeResponse?.tokens || 0
  const columnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const selectionStartRef = useRef<{ column: string; timestamp: number } | null>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [advanceControlsOpen, setAdvanceControlsOpen] = useState(false)

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

        // Get the column elements - safely handle different node types
        const getColumnElement = (node: Node): HTMLElement | null => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.parentElement?.closest('[data-model-column]') as HTMLElement || null
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            return (node as Element).closest('[data-model-column]') as HTMLElement || null
          }
          return null
        }

        const startColumn = getColumnElement(startContainer)
        const endColumn = getColumnElement(endContainer)

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

  return (
    <div
      ref={columnRef}
      data-model-column={id}
      className={cn(
        "flex-shrink-0 flex flex-col relative rounded-xl overflow-hidden border border-white/10 bg-[#0F0F0F]/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20",
        className
      )}
      style={{
        width,
        userSelect: 'none',
        ...style
      }}
    >
      {/* Header - Minimal & Clean */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}40` }}
          />
          <h3 className="text-white/90 font-medium text-[15px] tracking-tight">{name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAdvanceControlsOpen(true)}
            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Version Tabs - Segmented Control Style */}
      <div className="px-5 py-3 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {responses.map((response) => (
            <button
              key={response.id}
              onClick={() => onVersionChange(response.version)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap",
                activeVersion === response.version
                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              )}
            >
              {response.version}
            </button>
          ))}
          <button
            onClick={onAddVersion}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 whitespace-nowrap flex items-center gap-1"
          >
            <span>+</span> New
          </button>
        </div>
      </div>

      {/* Response Body */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-5 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
        style={{
          userSelect: 'text',
          paddingBottom: contentPaddingBottom
        }}
      >
        {activeResponse && (
          <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">
            <div className="prose prose-invert max-w-none">
              <div
                className="text-white/80 whitespace-pre-wrap font-sans text-[15px] leading-7 tracking-normal"
                style={{
                  userSelect: 'text'
                }}
                dangerouslySetInnerHTML={{
                  __html: activeResponse.content
                    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-semibold text-white mb-4 mt-2 tracking-tight">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-medium text-white/90 mb-3 mt-6 tracking-tight">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-white/90 mb-2 mt-4">$1</h3>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold text-white">$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em class="text-white/60 italic">$1</em>')
                    .replace(/^- (.*$)/gim, '<li class="text-white/70 ml-4 pl-2 relative before:content-[\'•\'] before:absolute before:-left-4 before:text-white/30">$1</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li class="text-white/70 ml-4 list-decimal marker:text-white/30">$1</li>')
                    .replace(/`([^`]+)`/gim, '<code class="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/5">$1</code>')
                    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm font-mono text-white/80">$2</code></pre>')
                    .replace(/\n\n/gim, '</p><p class="mb-4 last:mb-0">')
                    .replace(/^(.)/gim, '<p class="mb-4 last:mb-0">$1')
                }}
              />
            </div>

            {/* Inline Actions & Stats - Compact Footer */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/5">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  onClick={onOpenDiff}
                >
                  <Diff className="w-3.5 h-3.5 mr-1.5" />
                  Diff
                </Button>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-medium text-white/30 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <Timer className="w-3 h-3" />
                  <span>{displayLatency.toFixed(1)}s</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3 h-3" />
                  <span>{displayTokens} tok</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      <div
        className={cn(
          "absolute bottom-6 right-6 z-20 transition-all duration-300 transform",
          showScrollToBottom ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={handleScrollToBottom}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Advanced Controls Modal */}
      <Dialog open={advanceControlsOpen} onOpenChange={setAdvanceControlsOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-auto max-h-[95vh] bg-[#0F0F0F] border-white/10 text-white overflow-hidden flex flex-col p-0 md:max-w-2xl md:max-h-[85vh] shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b border-white/5">
            <DialogTitle className="text-white text-lg font-medium flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-white/70" />
              Model Settings
              <span className="text-white/40 font-normal text-sm ml-2">— {name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 pb-6 pt-4">
            <AdvanceControls modelId={id} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
