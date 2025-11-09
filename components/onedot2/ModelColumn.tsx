'use client'

import { useState, useRef, useEffect } from 'react'
import { Timer, Coins, Copy, Diff, Download, GripVertical } from 'lucide-react'
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
  minWidth: string
  maxWidth: string
  defaultWidth: string
  onWidthChange: (modelId: string, newWidth: number) => void
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
  minWidth,
  maxWidth,
  defaultWidth,
  onWidthChange
}: ModelColumnProps) {
  const activeResponse = responses.find(r => r.version === activeVersion) || responses[0]
  const displayLatency = activeResponse?.latency || 0
  const displayTokens = activeResponse?.tokens || 0
  const columnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const selectionStartRef = useRef<{ column: string; timestamp: number } | null>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const versionTabsRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [showSnapIndicator, setShowSnapIndicator] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)
  const [isHoveringResizeArea, setIsHoveringResizeArea] = useState(false)
  const [resizeHandleHeight, setResizeHandleHeight] = useState(0)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)
  const defaultWidthPxRef = useRef<number>(0)

  // Calculate resize handle height based on header and version tabs
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current && versionTabsRef.current) {
        const totalHeight = headerRef.current.offsetHeight + versionTabsRef.current.offsetHeight
        setResizeHandleHeight(totalHeight)
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

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

  // Calculate default width in pixels
  useEffect(() => {
    const calculateDefaultWidth = () => {
      if (columnRef.current) {
        const parent = columnRef.current.parentElement
        if (parent) {
          const parentWidth = parent.clientWidth
          // Parse defaultWidth (could be percentage or pixel value)
          if (defaultWidth.includes('%')) {
            const percentage = parseFloat(defaultWidth) / 100
            defaultWidthPxRef.current = parentWidth * percentage
          } else if (defaultWidth.includes('px')) {
            defaultWidthPxRef.current = parseFloat(defaultWidth)
          }
        }
      }
    }

    calculateDefaultWidth()
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateDefaultWidth)
    return () => window.removeEventListener('resize', calculateDefaultWidth)
  }, [defaultWidth])

  // Resize functionality
  useEffect(() => {
    const handle = resizeHandleRef.current
    const header = headerRef.current
    const versionTabs = versionTabsRef.current
    if (!handle || !columnRef.current || !header || !versionTabs) return

    let isResizingLocal = false

    const handleMouseDown = (e: MouseEvent) => {
      // Only allow resize if clicking on the resize handle or in the header/version tabs area
      const target = e.target as HTMLElement
      const isInResizeArea = header.contains(target) || versionTabs.contains(target) || handle.contains(target)
      
      if (!isInResizeArea) return
      
      // Check if click is near the right edge (within 8px) when clicking in header/version tabs
      if (!handle.contains(target)) {
        const rect = columnRef.current!.getBoundingClientRect()
        const clickX = e.clientX
        const distanceFromRight = rect.right - clickX
        
        if (distanceFromRight > 8) return // Not close enough to the edge
      }
      
      e.preventDefault()
      e.stopPropagation()
      isResizingLocal = true
      setIsResizing(true)
      startXRef.current = e.clientX
      startWidthRef.current = columnRef.current!.offsetWidth
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingLocal || !columnRef.current) return

      const deltaX = e.clientX - startXRef.current
      const newWidth = startWidthRef.current + deltaX
      const minWidthPx = parseFloat(minWidth) || 300
      const maxWidthPx = maxWidth === 'none' ? Infinity : parseFloat(maxWidth) || 800

      // Clamp width
      const clampedWidth = Math.max(minWidthPx, Math.min(newWidth, maxWidthPx))
      
      // Check if close to default width (within 20px threshold)
      const distanceFromDefault = Math.abs(clampedWidth - defaultWidthPxRef.current)
      const snapThreshold = 20

      if (distanceFromDefault < snapThreshold) {
        setShowSnapIndicator(true)
      } else {
        setShowSnapIndicator(false)
      }

      onWidthChange(id, clampedWidth)
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isResizingLocal) return

      const currentWidth = columnRef.current?.offsetWidth || 0
      const distanceFromDefault = Math.abs(currentWidth - defaultWidthPxRef.current)
      const snapThreshold = 20

      // If close to default, snap back
      if (distanceFromDefault < snapThreshold) {
        setIsSnapping(true)
        setShowSnapIndicator(true)
        
        // Animate to default width
        onWidthChange(id, defaultWidthPxRef.current)
        
        setTimeout(() => {
          setIsSnapping(false)
          setShowSnapIndicator(false)
        }, 300)
      } else {
        setShowSnapIndicator(false)
      }

      isResizingLocal = false
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    // Add listeners to header and version tabs for easier grabbing
    header.addEventListener('mousedown', handleMouseDown)
    versionTabs.addEventListener('mousedown', handleMouseDown)
    handle.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      header.removeEventListener('mousedown', handleMouseDown)
      versionTabs.removeEventListener('mousedown', handleMouseDown)
      handle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [id, minWidth, maxWidth, onWidthChange])

  return (
    <div
      ref={columnRef}
      data-model-column={id}
      className={`flex-shrink-0 flex flex-col relative ${isSnapping ? '' : 'border-r border-[#1a1a1a]'}`}
      style={{
        width,
        minWidth,
        maxWidth,
        userSelect: 'none',
        transition: isSnapping ? 'width 300ms ease-out' : 'none',
        borderRight: isSnapping ? '2px solid #ff4f2b' : undefined,
        boxShadow: isSnapping ? '0 0 8px rgba(255, 79, 43, 0.5)' : undefined
      }}
    >
      {/* Resize Handle - Always present, only visible on header and version tabs area */}
      <div
        ref={resizeHandleRef}
        className="absolute cursor-col-resize z-10 transition-all duration-200"
        style={{
          top: 0,
          right: '0px',
          height: resizeHandleHeight > 0 ? `${resizeHandleHeight}px` : 'auto',
          width: '8px',
          backgroundColor: (isHoveringResizeArea || isResizing || showSnapIndicator)
            ? (showSnapIndicator 
                ? '#ff4f2b' 
                : isResizing 
                  ? '#ff4f2b60' 
                  : '#ff4f2b30')
            : 'transparent',
          opacity: (isHoveringResizeArea || isResizing || showSnapIndicator) ? 1 : 0,
          pointerEvents: 'auto' // Always clickable when hovering header/version tabs
        }}
      >
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity pointer-events-none"
          style={{
            opacity: (isResizing || isHoveringResizeArea) ? 1 : 0.7
          }}
        >
          <GripVertical className="w-3 h-3 text-[#ff4f2b]" />
        </div>
      </div>
      {/* Header */}
      <div 
        ref={headerRef}
        className="bg-[#111111] p-4 border-b-2 relative"
        style={{ borderColor: color }}
        onMouseEnter={() => setIsHoveringResizeArea(true)}
        onMouseLeave={() => {
          if (!isResizing) {
            setIsHoveringResizeArea(false)
          }
        }}
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
        ref={versionTabsRef}
        className="bg-[#0a0a0a] px-4 py-2 border-b border-[#1a1a1a] relative"
        onMouseEnter={() => setIsHoveringResizeArea(true)}
        onMouseLeave={() => {
          if (!isResizing) {
            setIsHoveringResizeArea(false)
          }
        }}
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
    </div>
  )
}

