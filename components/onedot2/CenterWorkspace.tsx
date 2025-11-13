'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { DiffModal } from './DiffModal'
import { ModelColumn, ModelResponse } from './ModelColumn'
import { MODEL_CONFIGS, getModelConfig } from '@/lib/model-config'
import { cn } from '@/lib/utils'
import type { ChatData } from '@/lib/chat-storage'

interface CenterWorkspaceProps {
  leftCollapsed: boolean
  activeModels: string[]
  chatId?: string
  chatData?: ChatData
}

interface ModelColumnData {
  id: string
  name: string
  color: string
  responses: ModelResponse[]
}

export function CenterWorkspace({ leftCollapsed, activeModels, chatId, chatData }: CenterWorkspaceProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Convert chat data to model column format
  const models = useMemo<ModelColumnData[]>(() => {
    if (!chatData || !chatData.messages || chatData.messages.length === 0) {
      // No messages - return empty models for active models only
      return activeModels
        .map(modelId => {
          const config = getModelConfig(modelId)
          if (!config) return null
          return {
            id: config.id,
            name: config.name,
            color: config.color,
            responses: []
          }
        })
        .filter((m): m is ModelColumnData => m !== null)
    }

    // Get the latest message (most recent)
    const latestMessage = chatData.messages[chatData.messages.length - 1]
    if (!latestMessage || !latestMessage.modelResponses) {
      return []
    }

    // Convert model responses to ModelColumnData format
    return activeModels
      .map(modelId => {
        const config = getModelConfig(modelId)
        if (!config) return null

        const modelResponses = latestMessage.modelResponses[modelId] || []
        const responses: ModelResponse[] = modelResponses.map((resp, index) => ({
          id: resp.id,
          version: resp.version || `v${index + 1}`,
          content: resp.content,
          timestamp: resp.timestamp,
          latency: resp.latency || 0,
          tokens: resp.tokens || 0
        }))

        return {
          id: config.id,
          name: config.name,
          color: config.color,
          responses
        }
      })
      .filter((m): m is ModelColumnData => m !== null)
  }, [chatData, activeModels])

  const [modelsState, setModelsState] = useState<ModelColumnData[]>(models)
  
  // Update models when chatData or activeModels change
  useEffect(() => {
    setModelsState(models)
  }, [models])

  // Initialize active versions based on available responses
  const [activeVersions, setActiveVersions] = useState<Record<string, string>>(() => {
    const versions: Record<string, string> = {}
    models.forEach(model => {
      if (model.responses.length > 0) {
        versions[model.id] = model.responses[0].version
      }
    })
    return versions
  })

  // Update active versions when models change
  useEffect(() => {
    setActiveVersions(prev => {
      const newVersions: Record<string, string> = {}
      models.forEach(model => {
        if (model.responses.length > 0) {
          // Keep existing version if it exists and is valid, otherwise use first response
          const existingVersion = prev[model.id]
          const isValidVersion = existingVersion && model.responses.some(r => r.version === existingVersion)
          newVersions[model.id] = isValidVersion ? existingVersion : model.responses[0].version
        }
      })
      return { ...prev, ...newVersions }
    })
  }, [models])

  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean
    models: Array<{
      id: string
      name: string
      color: string
      content: string
    }>
  }>({
    isOpen: false,
    models: []
  })

  const addNewVersion = (modelId: string) => {
    setModelsState(prev => prev.map(model => {
      if (model.id === modelId) {
        const newVersion = `v${model.responses.length + 1}`
        const newResponse: ModelResponse = {
          id: Date.now().toString(),
          version: newVersion,
          content: `# New Response - ${newVersion}\n\nGenerating new response...`,
          timestamp: new Date().toISOString(),
          latency: Math.random() * 2 + 0.5,
          tokens: Math.floor(Math.random() * 200) + 50
        }
        return {
          ...model,
          responses: [...model.responses, newResponse]
        }
      }
      return model
    }))
    setActiveVersions(prev => {
      const model = modelsState.find(m => m.id === modelId)
      const numResponses = model ? model.responses.length : 0
      return {
        ...prev,
        [modelId]: `v${numResponses + 1}`
      }
    })
  }

  const handleVersionChange = (modelId: string, version: string) => {
    setActiveVersions(prev => ({
      ...prev,
      [modelId]: version
    }))
  }

  const openDiffModal = (modelId: string) => {
    // Get all active models (all models that are currently selected/visible)
    const activeModelsList = modelsState.filter(model => activeModels.includes(model.id))
    
    if (activeModelsList.length === 0) return
    
    // Get active responses for all active models
    const comparisonModels = activeModelsList.map(model => {
      const activeVersion = activeVersions[model.id] || model.responses[0]?.version || 'v1'
      const activeResponse = model.responses.find(r => r.version === activeVersion) || model.responses[0]
      
      return {
        id: model.id,
        name: model.name,
        color: model.color,
        content: activeResponse?.content || ''
      }
    }).filter(m => m.content) // Only include models with content
    
    if (comparisonModels.length > 0) {
      setDiffModal({
        isOpen: true,
        models: comparisonModels
      })
    }
  }

  const activeModelsList = modelsState.filter(model => activeModels.includes(model.id))
  const activeCount = activeModelsList.length
  
  // Calculate column width: mobile shows 1.05 columns, desktop shows 3 columns
  const getColumnWidth = () => {
    if (activeCount <= 2) {
      return `${100 / activeCount}%`
    } else {
      // Mobile: 1.05 columns with 6px gap, Desktop: 3 columns with 12px gap
      return 'calc((100% - 6px) / 1.05)'
    }
  }

  // Handle smooth scroll snapping one model at a time (desktop only)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || activeCount <= 2) return
    
    // Disable scroll snapping on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) return

    let scrollTimeout: NodeJS.Timeout
    let isSnapping = false

    const handleScroll = () => {
      if (isSnapping) return

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        snapToNearestModel()
      }, 100)
    }

    const snapToNearestModel = () => {
      if (!container || isSnapping) return
      
      isSnapping = true
      const containerWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      const columnWidth = containerWidth / 3.2
      
      // Calculate which model we should snap to (one at a time)
      const currentModelIndex = Math.round(scrollLeft / columnWidth)
      const targetScroll = currentModelIndex * columnWidth
      
      // Ensure we don't scroll beyond bounds
      const maxScroll = container.scrollWidth - containerWidth
      const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll))
      
      container.scrollTo({
        left: clampedScroll,
        behavior: 'smooth'
      })

      setTimeout(() => {
        isSnapping = false
      }, 300)
    }

    // Handle wheel events - move one model at a time
    const handleWheel = (e: WheelEvent) => {
      if (isSnapping) {
        e.preventDefault()
        return
      }

      // Only handle horizontal scrolling (even small amounts)
      if (Math.abs(e.deltaX) > 0) {
        e.preventDefault()
        e.stopPropagation()
        
        const containerWidth = container.clientWidth
        const columnWidth = containerWidth / 3.2
        const currentScroll = container.scrollLeft
        
        // Determine direction based on scroll delta
        // Even small scrolls should move to next/previous model
        const direction = e.deltaX > 0 ? 1 : -1
        
        // Calculate current model index
        const currentModelIndex = Math.round(currentScroll / columnWidth)
        
        // Move to next or previous model
        const targetModelIndex = currentModelIndex + direction
        const targetScroll = targetModelIndex * columnWidth
        
        // Ensure we don't scroll beyond bounds
        const maxScroll = container.scrollWidth - containerWidth
        const clampedScroll = Math.max(0, Math.min(targetScroll, maxScroll))
        
        // Only move if we're not already at the target
        if (Math.abs(clampedScroll - currentScroll) > 10) {
          isSnapping = true
          container.scrollTo({
            left: clampedScroll,
            behavior: 'smooth'
          })

          setTimeout(() => {
            isSnapping = false
          }, 300)
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleWheel)
      clearTimeout(scrollTimeout)
    }
  }, [activeCount, activeModelsList])

  return (
    <div className="h-full w-full bg-black overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className={cn(
          "h-full w-full flex overflow-x-auto",
          chatId ? "gap-1.5 md:gap-3" : "gap-0"
        )}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#333333 #0a0a0a',
          scrollBehavior: 'smooth',
          userSelect: 'none',
          padding: '12px'
        }}
      >
        {activeModelsList.length > 0 ? (
          activeModelsList.map((model) => (
          <ModelColumn
            key={model.id}
            id={model.id}
            name={model.name}
            color={model.color}
            responses={model.responses}
              activeVersion={activeVersions[model.id] || (model.responses[0]?.version || 'v1')}
            onVersionChange={(version) => handleVersionChange(model.id, version)}
            onAddVersion={() => addNewVersion(model.id)}
            onOpenDiff={() => openDiffModal(model.id)}
            width={getColumnWidth()}
            className={chatId ? "md:!w-[calc((100%-12px)/3)]" : "md:!w-[calc(100%/3)]"}
          />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#666666] text-sm">
            No messages yet. Start a conversation to see model responses here.
          </div>
        )}
      </div>

      {/* Diff Modal */}
      <DiffModal
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal(prev => ({ ...prev, isOpen: false }))}
        models={diffModal.models}
      />
    </div>
  )
}