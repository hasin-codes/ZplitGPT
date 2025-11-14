'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Trash2, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

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

export function FlowModal({ isOpen, onClose }: FlowModalProps) {
  const [systemContexts, setSystemContexts] = useState<SavedItem[]>([])
  const [chatMemories, setChatMemories] = useState<SavedItem[]>([])
  const [selectedContextIds, setSelectedContextIds] = useState<Set<string>>(new Set())
  const [newContextInput, setNewContextInput] = useState('')
  const [showNewContextInput, setShowNewContextInput] = useState(false)

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
        const memories = JSON.parse(memoriesJson)
        setChatMemories(memories)
        const memoryContextIds = new Set<string>(memories.map((m: SavedItem) => m.id.replace('-memory', '')))
        setSelectedContextIds(memoryContextIds)
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
    if (selectedContextIds.has(context.id)) {
      const updatedMemories = chatMemories.filter(m => m.id !== `${context.id}-memory`)
      setChatMemories(updatedMemories)
      saveMemoriesToStorage(updatedMemories)
      setSelectedContextIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(context.id)
        return newSet
      })
    } else {
      const newMemory: SavedItem = {
        id: `${context.id}-memory`,
        content: context.content,
        timestamp: new Date().toISOString(),
        isNew: true
      }
      const updatedMemories = [newMemory, ...chatMemories]
      setChatMemories(updatedMemories)
      saveMemoriesToStorage(updatedMemories)
      setSelectedContextIds(prev => new Set(prev).add(context.id))
      
      setTimeout(() => {
        setChatMemories(prev => prev.map(m => 
          m.id === newMemory.id ? { ...m, isNew: false } : m
        ))
      }, 3000)
    }
  }

  const handleDeleteContext = (id: string) => {
    const memoryId = `${id}-memory`
    const updatedMemories = chatMemories.filter(m => m.id !== memoryId)
    setChatMemories(updatedMemories)
    saveMemoriesToStorage(updatedMemories)
    
    const updated = systemContexts.filter(item => item.id !== id)
    setSystemContexts(updated)
    saveContextsToStorage(updated)
    setSelectedContextIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleDeleteMemory = (id: string) => {
    const updated = chatMemories.filter(item => item.id !== id)
    setChatMemories(updated)
    saveMemoriesToStorage(updated)
    
    const contextId = id.replace('-memory', '')
    setSelectedContextIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(contextId)
      return newSet
    })
  }

  const handleForgetAllContexts = () => {
    setSystemContexts([])
    saveContextsToStorage([])
    setChatMemories([])
    saveMemoriesToStorage([])
    setSelectedContextIds(new Set())
  }

  const handleForgetAllMemories = () => {
    setChatMemories([])
    saveMemoriesToStorage([])
    setSelectedContextIds(new Set())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] overflow-hidden flex flex-col p-0"
        style={{ 
          width: '80vw',
          height: '40vw',
          maxWidth: '1600px',
          maxHeight: '800px'
        }}
        showCloseButton={true}
      >
        <DialogHeader className="px-8 pt-6 pb-5 flex-shrink-0 border-b border-[#1a1a1a]">
          <DialogTitle className="text-[#f5f5f5] text-2xl font-semibold">Flow: System Context & Chat Memory</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-8 overflow-hidden px-8 py-6">
          {/* Left Column: System Context */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#f5f5f5] text-lg font-semibold">System Context</h3>
              {systemContexts.length > 0 && (
                <Button
                  onClick={handleForgetAllContexts}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-[#666666] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] h-9 px-4"
                >
                  Clear All
                </Button>
              )}
            </div>

            {showNewContextInput ? (
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#333333] space-y-4 mb-4">
                <Textarea
                  value={newContextInput}
                  onChange={(e) => setNewContextInput(e.target.value)}
                  placeholder="Enter new system context..."
                  className="w-full bg-[#0a0a0a] border-[#333333] text-[#f5f5f5] placeholder-[#666666] resize-none focus:border-[#ff4f2b] min-h-[100px] text-base"
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddContext}
                    disabled={!newContextInput.trim()}
                    className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm h-10 px-6"
                  >
                    Add Context
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewContextInput(false)
                      setNewContextInput('')
                    }}
                    variant="outline"
                    className="border-[#333333] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] text-sm h-10 px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowNewContextInput(true)}
                variant="outline"
                className="w-full border-[#333333] border-dashed text-[#b3b3b3] hover:text-[#ff4f2b] hover:border-[#ff4f2b] hover:bg-[#1a1a1a] text-sm h-11 mb-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New System Context
              </Button>
            )}

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {systemContexts.map((item) => {
                const isSelected = selectedContextIds.has(item.id)
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-xl border transition-all relative overflow-hidden",
                      isSelected
                        ? "bg-[#ff8c5a]/10 border-[#ff8c5a] shadow-[0_0_12px_rgba(255,140,90,0.15)]"
                        : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#151515]"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff8c5a]" />
                    )}
                    
                    <div className="p-4 pr-20">
                      <p className={cn(
                        "text-base leading-relaxed",
                        isSelected ? "text-[#ff8c5a] font-medium" : "text-[#e5e5e5]"
                      )}>
                        {item.content}
                      </p>
                    </div>

                    <div className="absolute right-4 top-4 flex items-center gap-1">
                      <Button
                        onClick={() => handleMoveToMemory(item)}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 transition-all rounded-lg",
                          isSelected
                            ? "text-[#ff8c5a] hover:bg-[#ff8c5a]/20 bg-[#ff8c5a]/10"
                            : "text-[#666666] hover:text-[#ff4f2b] hover:bg-[#2a2a2a]"
                        )}
                        aria-label={isSelected ? "Remove from memory" : "Add to memory"}
                        title={isSelected ? "Remove from memory" : "Add to memory"}
                      >
                        <ArrowRight className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isSelected && "rotate-180"
                        )} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteContext(item.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#666666] hover:text-[#ff4f2b] hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        aria-label="Delete context"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              {systemContexts.length === 0 && !showNewContextInput && (
                <div className="flex-1 flex items-center justify-center py-20">
                  <p className="text-[#666666] text-sm">No system contexts yet. Click above to add one.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Memory */}
          <div className="w-1/2 flex flex-col overflow-hidden border-l border-[#1a1a1a] pl-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#f5f5f5] text-lg font-semibold">Chat Memory</h3>
              {chatMemories.length > 0 && (
                <Button
                  onClick={handleForgetAllMemories}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-[#666666] hover:text-[#ff4f2b] hover:bg-[#1a1a1a] h-9 px-4"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {chatMemories.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-xl border transition-all relative overflow-hidden group",
                    item.isNew 
                      ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_16px_rgba(6,182,212,0.12)]" 
                      : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#151515]"
                  )}
                >
                  {item.isNew && (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 animate-pulse" />
                      <div className="absolute top-3 right-3">
                        <span className="text-xs text-cyan-400 px-2 py-1 bg-cyan-500/20 rounded-md font-medium animate-pulse">
                          New
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className={cn(
                    "p-4",
                    item.isNew ? "pr-20" : "pr-16"
                  )}>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      item.isNew ? "text-cyan-100" : "text-[#e5e5e5]"
                    )}>
                      {item.content}
                    </p>
                  </div>

                  <div className="absolute right-4 top-4">
                    <Button
                      onClick={() => handleDeleteMemory(item.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#666666] hover:text-[#ff4f2b] hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {chatMemories.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-20">
                  <p className="text-[#666666] text-sm text-center max-w-xs">
                    No chat memories yet. Add system contexts from the left panel to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}