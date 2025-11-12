'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, ChevronUp, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface ModelComparison {
  id: string
  name: string
  color: string
  content: string
}

interface DiffModalProps {
  isOpen: boolean
  onClose: () => void
  models: ModelComparison[]
}

export function DiffModal({ isOpen, onClose, models }: DiffModalProps) {
  const isMobile = useIsMobile()
  const [expandedModels, setExpandedModels] = useState<{ [key: string]: boolean }>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedModelIndex, setSelectedModelIndex] = useState(0)

  // Initialize expanded state
  useEffect(() => {
    if (isOpen && models.length > 0) {
      if (isMobile) {
        // On mobile, collapse all by default (user can expand what they want)
        const initialExpanded: { [key: string]: boolean } = {}
        // Optionally expand first model on mobile for better UX
        if (models[0]) {
          initialExpanded[models[0].id] = true
        }
        setExpandedModels(initialExpanded)
        setSelectedModelIndex(0)
      } else {
        // On desktop, all models are always visible in table
        const allExpanded: { [key: string]: boolean } = {}
        models.forEach(model => {
          allExpanded[model.id] = true
        })
        setExpandedModels(allExpanded)
      }
    }
  }, [isOpen, models, isMobile])

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isOpen])

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => {
        setShouldRender(false)
      }, 300)
    }
  }, [isOpen])

  if (models.length === 0 || !shouldRender) return null

  const colors = [
    '#ff6b4a', '#4a9eff', '#10a37f', '#d97757', '#4285f4', 
    '#ff7000', '#ff6a00', '#1a56db', '#5b8def'
  ]

  const toggleModelExpanded = (modelId: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }))
  }

  // Analyze differences between models
  const analyzeDifferences = () => {
    const allContents = models.map(m => m.content.split('\n'))
    const maxLines = Math.max(...allContents.map(c => c.length))
    const differences: Array<{
      lineIndex: number
      lineContents: string[]
      allSame: boolean
    }> = []
    
    for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
      const lineContents = allContents.map(content => content[lineIndex] || '')
      const allSame = lineContents.every((line, i) => 
        i === 0 || line === lineContents[0]
      )
      differences.push({
        lineIndex,
        lineContents,
        allSame
      })
    }
    
    return differences
  }

  const differences = analyzeDifferences()

  // Render desktop table view
  const renderDesktopTable = () => {
    const tableWidth = `${models.length * 500}px`
    
    return (
      <div 
        className="overflow-x-auto overflow-y-auto max-h-[65vh]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#333333 #0a0a0a'
        }}
      >
        <table 
          className="border-collapse"
          style={{
            width: tableWidth,
            minWidth: tableWidth
          }}
        >
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {models.map((model, index) => {
                const color = model.color || colors[index % colors.length]
                return (
                  <th
                    key={model.id}
                    className={`p-3 text-left font-medium ${
                      index < models.length - 1 ? 'border-r border-[#1a1a1a]' : ''
                    }`}
                    style={{ 
                      color,
                      width: '500px',
                      minWidth: '500px'
                    }}
                  >
                    {model.name}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {differences.map((diff) => (
              <tr key={diff.lineIndex} className={diff.allSame ? '' : 'bg-[#1a1a1a]'}>
                {models.map((model, modelIndex) => {
                  const line = diff.lineContents[modelIndex]
                  const isDifferent = !diff.allSame
                  const color = model.color || colors[modelIndex % colors.length]
                  
                  return (
                    <td
                      key={model.id}
                      className={`p-2 font-mono text-sm ${
                        modelIndex < models.length - 1 ? 'border-r border-[#1a1a1a]' : ''
                      }`}
                      style={{
                        color: isDifferent ? color : '#b3b3b3',
                        width: '500px',
                        minWidth: '500px'
                      }}
                    >
                      {line || '\u00A0'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Render mobile vertical comparison view
  const renderMobileComparison = () => {
    return (
      <div className="flex flex-col space-y-4">
        {/* All models in vertical stack */}
        <div className="space-y-3">
          {models.map((model, modelIndex) => {
            const color = model.color || colors[modelIndex % colors.length]
            const contentLines = model.content.split('\n')
            const isExpanded = expandedModels[model.id] !== false
            
            return (
              <div key={model.id} className="space-y-2">
                {/* Model header - collapsible */}
                <button
                  onClick={() => toggleModelExpanded(model.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: `${color}40`
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-[#f5f5f5] truncate" style={{ color }}>
                      {model.name}
                    </span>
                    {/* Show difference indicator */}
                    {differences.some(d => {
                      if (d.allSame) return false
                      // Check if this model's line differs from the first model's line
                      return d.lineContents[modelIndex] !== d.lineContents[0]
                    }) && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#1a1a1a] text-[#b3b3b3] flex-shrink-0">
                        Different
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#b3b3b3] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#b3b3b3] flex-shrink-0" />
                  )}
                </button>

                {/* Model content - expandable */}
                {isExpanded && (
                  <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
                    <div className="font-mono text-xs sm:text-sm text-[#f5f5f5] whitespace-pre-wrap break-words">
                      {contentLines.map((line, lineIndex) => {
                        // Check if this line differs from the baseline (first model)
                        const diff = differences.find(d => d.lineIndex === lineIndex)
                        const isDifferent = diff 
                          ? (!diff.allSame && diff.lineContents[modelIndex] !== diff.lineContents[0])
                          : false
                        
                        return (
                          <div
                            key={lineIndex}
                            className={cn(
                              "px-2 py-1 rounded mb-0.5",
                              isDifferent && "bg-[#1a1a1a]"
                            )}
                            style={{
                              color: isDifferent ? color : '#b3b3b3'
                            }}
                          >
                            {line || '\u00A0'}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Comparison summary */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="w-4 h-4 text-[#ff4f2b]" />
            <span className="text-sm font-medium text-[#f5f5f5]">Legend</span>
          </div>
          <div className="space-y-2 text-xs text-[#b3b3b3]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#333333]" />
              <span>Same content across all models</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#666666]" />
              <span>Different content (highlighted in model color)</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile: Full-screen modal
  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col",
          "transition-transform duration-300 ease-out",
          isAnimating ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => {
          // Prevent closing when clicking inside modal
          e.stopPropagation()
        }}
      >
        {/* Mobile Header - Sticky */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a] bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <GitCompare className="w-5 h-5 text-[#ff4f2b] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[#f5f5f5] truncate">
                Comparison: {models.length} Model{models.length > 1 ? 's' : ''}
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] h-9 w-9 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Content - Scrollable */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {renderMobileComparison()}
          
          {/* Spacer for better scrolling */}
          <div className="h-4" />
        </div>

        {/* Mobile Footer - Sticky */}
        <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] p-4 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <Button
            onClick={onClose}
            className="w-full bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white h-12 font-medium"
          >
            Close
          </Button>
        </div>
      </div>
    )
  }

  // Desktop: Centered modal
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-h-[85vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5]",
          "transition-all duration-300 ease-out",
          isAnimating
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        )}
        style={{
          width: '90vw',
          maxWidth: '90vw'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#f5f5f5] flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#ff4f2b]" />
            Response Comparison: {models.length} Model{models.length > 1 ? 's' : ''}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-[#b3b3b3] hover:text-[#f5f5f5]"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        {renderDesktopTable()}
        
        <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
          <div className="text-xs text-[#666666] flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-[#1a1a1a] border border-[#333333]"></span>
              <span>Same content</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-[#1a1a1a] border border-[#333333]"></span>
              <span>Different content (highlighted in model color)</span>
            </div>
          </div>
          <Button 
            onClick={onClose} 
            className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}