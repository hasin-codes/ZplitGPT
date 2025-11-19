'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Trash2, Plus, Search, Sparkles, X, GripVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SavedItem {
  id: string
  content: string
  timestamp: string
  isNew?: boolean
}

interface FlowModalProps {
  isOpen: boolean
  onClose: () => void
}

// Sortable Item Component
function SortableItem({
  item,
  type,
  onDelete,
  onMove
}: {
  item: SavedItem
  type: 'system' | 'memory'
  onDelete: (id: string) => void
  onMove: (item: SavedItem) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { type, item } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-neutral-800/50 border border-neutral-700/50 rounded-xl h-[80px]"
      />
    )
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-xl border p-4 transition-colors duration-200 select-none cursor-grab active:cursor-grabbing",
        type === 'system'
          ? "bg-neutral-900/50 border-neutral-800 hover:border-orange-500/30 hover:bg-orange-500/5"
          : "bg-neutral-900/50 border-neutral-800 hover:border-blue-500/30 hover:bg-blue-500/5"
      )}
    >
      <div className="flex gap-3 items-start">
        <div className={cn(
          "mt-1 p-1 rounded transition-colors",
          type === 'system' ? "text-neutral-600 group-hover:text-orange-500" : "text-neutral-600 group-hover:text-blue-500"
        )}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm leading-relaxed text-neutral-300",
            type === 'system' ? "group-hover:text-orange-100" : "group-hover:text-blue-100"
          )}>
            {item.content}
          </p>
          {type === 'memory' && (
            <p className="text-[10px] text-neutral-600 mt-2 font-mono">
              {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-900/90 rounded-lg p-1 border border-neutral-800"
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on buttons
      >
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onMove(item)
          }}
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 rounded-md transition-colors cursor-pointer",
            type === 'system'
              ? "text-neutral-500 hover:text-orange-400 hover:bg-orange-500/10"
              : "text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10"
          )}
        >
          <ArrowRight className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            type === 'memory' && "rotate-180"
          )} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item.id)
          }}
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}

export function FlowModal({ isOpen, onClose }: FlowModalProps) {
  const [systemContexts, setSystemContexts] = useState<SavedItem[]>([])
  const [chatMemories, setChatMemories] = useState<SavedItem[]>([])
  const [newContextInput, setNewContextInput] = useState('')
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDragItem, setActiveDragItem] = useState<SavedItem | null>(null)
  const [activeDragType, setActiveDragType] = useState<'system' | 'memory' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Add distance constraint to prevent accidental drags when clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Demo data for system contexts
  const getDemoContexts = (): SavedItem[] => [
    { id: 'demo-context-1', content: 'You are a helpful AI assistant that provides clear, accurate, and concise responses.', timestamp: new Date(Date.now() - 86400000 * 14).toISOString() },
    { id: 'demo-context-2', content: 'You are an expert software engineer specializing in React, TypeScript, and Next.js. Provide code examples and best practices.', timestamp: new Date(Date.now() - 86400000 * 13).toISOString() },
    { id: 'demo-context-3', content: 'You are a creative writing assistant. Help users craft compelling stories, develop characters, and improve narrative flow.', timestamp: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 'demo-context-4', content: 'You are a data science expert. Explain complex statistical concepts in simple terms and help with data analysis.', timestamp: new Date(Date.now() - 86400000 * 11).toISOString() },
    { id: 'demo-context-5', content: 'You are a business strategy consultant. Provide insights on market analysis, competitive positioning, and growth strategies.', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'demo-context-6', content: 'You are a cybersecurity expert. Help identify vulnerabilities, explain security best practices, and suggest protective measures.', timestamp: new Date(Date.now() - 86400000 * 9).toISOString() },
  ]

  const saveContextsToStorage = (contexts: SavedItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('Zplitgpt-flow-contexts', JSON.stringify(contexts))
  }

  const saveMemoriesToStorage = (memories: SavedItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('Zplitgpt-flow-memories', JSON.stringify(memories))
  }

  // Load saved items from localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen) return

    // Load system contexts
    const contextsJson = localStorage.getItem('Zplitgpt-flow-contexts')
    if (contextsJson) {
      try {
        setSystemContexts(JSON.parse(contextsJson))
      } catch (e) {
        console.error('Failed to parse saved contexts', e)
        const demoContexts = getDemoContexts()
        setSystemContexts(demoContexts)
        saveContextsToStorage(demoContexts)
      }
    } else {
      const demoContexts = getDemoContexts()
      setSystemContexts(demoContexts)
      saveContextsToStorage(demoContexts)
    }

    // Load chat memories
    const memoriesJson = localStorage.getItem('Zplitgpt-flow-memories')
    if (memoriesJson) {
      try {
        setChatMemories(JSON.parse(memoriesJson))
      } catch (e) {
        console.error('Failed to parse saved memories', e)
        setChatMemories([])
        saveMemoriesToStorage([])
      }
    } else {
      setChatMemories([])
      saveMemoriesToStorage([])
    }
  }, [isOpen])

  const handleAddContext = () => {
    if (!newContextInput.trim()) return

    const newContext: SavedItem = {
      id: `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: newContextInput.trim(),
      timestamp: new Date().toISOString()
    }

    const updated = [newContext, ...systemContexts]
    setSystemContexts(updated)
    saveContextsToStorage(updated)
    setNewContextInput('')
    setShowNewContextInput(false)
  }

  const handleMoveToMemory = (context: SavedItem) => {
    // Remove from System
    const updatedSystem = systemContexts.filter(c => c.id !== context.id)
    setSystemContexts(updatedSystem)
    saveContextsToStorage(updatedSystem)

    // Add to Memory
    const newMemory = { ...context, isNew: true, timestamp: new Date().toISOString() }
    const updatedMemories = [newMemory, ...chatMemories]
    setChatMemories(updatedMemories)
    saveMemoriesToStorage(updatedMemories)

    setTimeout(() => {
      setChatMemories(prev => prev.map(m =>
        m.id === newMemory.id ? { ...m, isNew: false } : m
      ))
    }, 3000)
  }

  const handleMoveToSystem = (memory: SavedItem) => {
    // Remove from Memory
    const updatedMemories = chatMemories.filter(m => m.id !== memory.id)
    setChatMemories(updatedMemories)
    saveMemoriesToStorage(updatedMemories)

    // Add to System
    const newSystem = { ...memory, isNew: true }
    const updatedSystem = [newSystem, ...systemContexts]
    setSystemContexts(updatedSystem)
    saveContextsToStorage(updatedSystem)
  }

  const handleDeleteContext = (id: string) => {
    const updated = systemContexts.filter(item => item.id !== id)
    setSystemContexts(updated)
    saveContextsToStorage(updated)
  }

  const handleDeleteMemory = (id: string) => {
    const updated = chatMemories.filter(item => item.id !== id)
    setChatMemories(updated)
    saveMemoriesToStorage(updated)
  }

  const handleForgetAllContexts = () => {
    setSystemContexts([])
    saveContextsToStorage([])
  }

  const handleForgetAllMemories = () => {
    setChatMemories([])
    saveMemoriesToStorage([])
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string
    const item = systemContexts.find(c => c.id === id) || chatMemories.find(m => m.id === id)

    if (item) {
      setActiveDragItem(item)
      setActiveDragType(systemContexts.find(c => c.id === id) ? 'system' : 'memory')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragItem(null)
    setActiveDragType(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Determine source and destination
    const isSourceSystem = systemContexts.some(i => i.id === activeId)
    const isDestSystem = overId === 'system-list' || systemContexts.some(i => i.id === overId)
    const isDestMemory = overId === 'memory-list' || chatMemories.some(i => i.id === overId)

    // Moving between lists
    if (isSourceSystem && isDestMemory) {
      const item = systemContexts.find(i => i.id === activeId)
      if (item) handleMoveToMemory(item)
    } else if (!isSourceSystem && isDestSystem) {
      const item = chatMemories.find(i => i.id === activeId)
      if (item) handleMoveToSystem(item)
    }
    // Reordering within same list
    else if (isSourceSystem && isDestSystem) {
      const oldIndex = systemContexts.findIndex(i => i.id === activeId)
      const newIndex = systemContexts.findIndex(i => i.id === overId)
      if (oldIndex !== newIndex && newIndex !== -1) {
        const updated = arrayMove(systemContexts, oldIndex, newIndex)
        setSystemContexts(updated)
        saveContextsToStorage(updated)
      }
    } else if (!isSourceSystem && isDestMemory) {
      const oldIndex = chatMemories.findIndex(i => i.id === activeId)
      const newIndex = chatMemories.findIndex(i => i.id === overId)
      if (oldIndex !== newIndex && newIndex !== -1) {
        const updated = arrayMove(chatMemories, oldIndex, newIndex)
        setChatMemories(updated)
        saveMemoriesToStorage(updated)
      }
    }
  }

  const filteredContexts = systemContexts.filter(item =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-neutral-950 border-neutral-800 text-neutral-100 overflow-hidden flex flex-col p-0 shadow-2xl sm:rounded-3xl"
        style={{
          width: '90vw',
          height: '85vh',
          maxWidth: '1400px',
          maxHeight: '900px'
        }}
        showCloseButton={false}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800 bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight text-white">Flow Control</DialogTitle>
                <p className="text-sm text-neutral-400 font-medium">Manage system contexts and active memory</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: System Context */}
            <div className="w-1/2 flex flex-col border-r border-neutral-800 bg-neutral-950">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-orange-500 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    System Contexts
                  </h3>
                  {systemContexts.length > 0 && (
                    <Button
                      onClick={handleForgetAllContexts}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-neutral-500 hover:text-red-400 hover:bg-red-500/10 h-7 px-3 rounded-lg transition-colors"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search contexts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {showNewContextInput ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="bg-neutral-900 rounded-2xl p-4 border border-orange-500/20 shadow-lg shadow-orange-500/5 overflow-hidden"
                    >
                      <Textarea
                        value={newContextInput}
                        onChange={(e) => setNewContextInput(e.target.value)}
                        placeholder="Enter a new system context..."
                        className="w-full bg-transparent border-none text-neutral-100 placeholder:text-neutral-600 resize-none focus:ring-0 min-h-[80px] text-sm p-0 leading-relaxed"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-neutral-800">
                        <Button
                          onClick={() => {
                            setShowNewContextInput(false)
                            setNewContextInput('')
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-neutral-400 hover:text-white hover:bg-white/5"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddContext}
                          disabled={!newContextInput.trim()}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        >
                          Add Context
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setShowNewContextInput(true)}
                      className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-neutral-800 text-neutral-500 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-neutral-900 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium">Create New Context</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                <SortableContext
                  id="system-list"
                  items={filteredContexts.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[100px]">
                    <AnimatePresence mode="popLayout">
                      {filteredContexts.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          type="system"
                          onDelete={handleDeleteContext}
                          onMove={handleMoveToMemory}
                        />
                      ))}
                    </AnimatePresence>
                    {filteredContexts.length === 0 && !showNewContextInput && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
                          <Search className="w-5 h-5 text-neutral-600" />
                        </div>
                        <p className="text-neutral-500 text-sm">No contexts found</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            </div>

            {/* Right Column: Chat Memory */}
            <div className="w-1/2 flex flex-col bg-neutral-950">
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium text-blue-500 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Active Memory
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                    {chatMemories.length} Active
                  </span>
                </div>
                {chatMemories.length > 0 && (
                  <Button
                    onClick={handleForgetAllMemories}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-neutral-500 hover:text-red-400 hover:bg-red-500/10 h-7 px-3 rounded-lg transition-colors"
                  >
                    Clear Memory
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <SortableContext
                  id="memory-list"
                  items={chatMemories.map(m => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[100px]">
                    <AnimatePresence mode="popLayout">
                      {chatMemories.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          type="memory"
                          onDelete={handleDeleteMemory}
                          onMove={handleMoveToSystem}
                        />
                      ))}
                    </AnimatePresence>

                    {chatMemories.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center mb-6 border border-dashed border-neutral-800">
                          <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
                            <ArrowRight className="w-5 h-5 text-neutral-600" />
                          </div>
                        </div>
                        <h4 className="text-neutral-300 font-medium mb-2">Memory Empty</h4>
                        <p className="text-neutral-500 text-sm max-w-[200px]">
                          Drag contexts here or use the arrow button to add them to active memory.
                        </p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            </div>
          </div>

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
            {activeDragItem ? (
              <div className={cn(
                "rounded-xl border p-4 bg-neutral-900 shadow-2xl cursor-grabbing w-[400px] select-none",
                activeDragType === 'system' ? "border-orange-500/50" : "border-blue-500/50"
              )}>
                <div className="flex gap-3 items-start">
                  <div className={cn(
                    "mt-1 p-1 rounded",
                    activeDragType === 'system' ? "text-orange-500" : "text-blue-500"
                  )}
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed text-neutral-200">
                      {activeDragItem.content}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </DialogContent>
    </Dialog>
  )
}