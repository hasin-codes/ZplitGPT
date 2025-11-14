'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface SavedItem {
  id: string
  content: string
  timestamp: string
}

interface ContextMemoryModalProps {
  isOpen: boolean
  onClose: () => void
  context: string
  onContextChange: (context: string) => void
  onSaveContext: () => void
  memory: string
  onMemoryChange: (memory: string) => void
  onSaveMemory: () => void
  chatId?: string
  defaultTab?: 'context' | 'memory'
}

export function ContextMemoryModal({
  isOpen,
  onClose,
  context,
  onContextChange,
  onSaveContext,
  memory,
  onMemoryChange,
  onSaveMemory,
  chatId,
  defaultTab = 'context'
}: ContextMemoryModalProps) {
  const [savedContexts, setSavedContexts] = useState<SavedItem[]>([])
  const [savedMemories, setSavedMemories] = useState<SavedItem[]>([])
  const [newContextInput, setNewContextInput] = useState('')
  const [newMemoryInput, setNewMemoryInput] = useState('')
  const [showNewContextInput, setShowNewContextInput] = useState(false)
  const [showNewMemoryInput, setShowNewMemoryInput] = useState(false)
  const [activeTab, setActiveTab] = useState<'context' | 'memory'>(defaultTab)

  // Update active tab when defaultTab prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, isOpen])

  const saveContextsToStorage = (contexts: SavedItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('Zplitgpt-contexts', JSON.stringify(contexts))
  }

  const saveMemoriesToStorage = (memories: SavedItem[]) => {
    if (typeof window === 'undefined') return
    const memoryKey = chatId ? `Zplitgpt-memories-${chatId}` : 'Zplitgpt-memories-default'
    localStorage.setItem(memoryKey, JSON.stringify(memories))
  }

  // Demo data
  const getDemoContexts = (): SavedItem[] => [
    { id: 'demo-context-1', content: 'You are a helpful AI assistant that provides clear, accurate, and concise responses.', timestamp: new Date(Date.now() - 86400000 * 14).toISOString() },
    { id: 'demo-context-2', content: 'You are an expert software engineer specializing in React, TypeScript, and Next.js. Provide code examples and best practices.', timestamp: new Date(Date.now() - 86400000 * 13).toISOString() },
    { id: 'demo-context-3', content: 'You are a creative writing assistant. Help users craft compelling stories, develop characters, and improve narrative flow.', timestamp: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 'demo-context-4', content: 'You are a data science expert. Explain complex statistical concepts in simple terms and help with data analysis.', timestamp: new Date(Date.now() - 86400000 * 11).toISOString() },
    { id: 'demo-context-5', content: 'You are a business strategy consultant. Provide insights on market analysis, competitive positioning, and growth strategies.', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'demo-context-6', content: 'You are a cybersecurity expert. Help identify vulnerabilities, explain security best practices, and suggest protective measures.', timestamp: new Date(Date.now() - 86400000 * 9).toISOString() },
    { id: 'demo-context-7', content: 'You are a language learning tutor. Provide explanations, examples, and practice exercises for language acquisition.', timestamp: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 'demo-context-8', content: 'You are a UX/UI design expert. Offer guidance on user experience, interface design, and usability principles.', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 'demo-context-9', content: 'You are a financial advisor. Provide insights on investments, budgeting, and financial planning strategies.', timestamp: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: 'demo-context-10', content: 'You are a health and wellness coach. Offer evidence-based advice on nutrition, exercise, and mental well-being.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'demo-context-11', content: 'You are a machine learning researcher. Explain ML concepts, algorithms, and help with model development and optimization.', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'demo-context-12', content: 'You are a DevOps engineer. Help with CI/CD pipelines, infrastructure as code, containerization, and cloud deployments.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'demo-context-13', content: 'You are a product manager. Assist with product strategy, feature prioritization, and user research methodologies.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'demo-context-14', content: 'You are a technical writer. Help create clear documentation, tutorials, and explain complex technical concepts.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'demo-context-15', content: 'You are a research assistant. Help gather information, analyze sources, and synthesize findings into coherent summaries.', timestamp: new Date().toISOString() },
  ]

  const getDemoMemories = (): SavedItem[] => [
    { id: 'demo-memory-1', content: 'User prefers detailed explanations with code examples when discussing technical topics.', timestamp: new Date(Date.now() - 86400000 * 14).toISOString() },
    { id: 'demo-memory-2', content: 'User is working on a Next.js project and frequently asks about App Router and Server Components.', timestamp: new Date(Date.now() - 86400000 * 13).toISOString() },
    { id: 'demo-memory-3', content: 'User prefers concise responses and gets frustrated with overly verbose explanations.', timestamp: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 'demo-memory-4', content: 'User is learning TypeScript and needs help understanding advanced type features.', timestamp: new Date(Date.now() - 86400000 * 11).toISOString() },
    { id: 'demo-memory-5', content: 'User is interested in AI/ML topics and wants to understand model architectures and training processes.', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'demo-memory-6', content: 'User prefers markdown formatting in code examples and technical explanations.', timestamp: new Date(Date.now() - 86400000 * 9).toISOString() },
    { id: 'demo-memory-7', content: 'User is building a SaaS product and frequently asks about authentication, payment integration, and scaling strategies.', timestamp: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: 'demo-memory-8', content: 'User has a background in Python and is transitioning to JavaScript/TypeScript development.', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 'demo-memory-9', content: 'User prefers step-by-step tutorials and gets overwhelmed by too much information at once.', timestamp: new Date(Date.now() - 86400000 * 6).toISOString() },
    { id: 'demo-memory-10', content: 'User is working on a team project and needs help with Git workflows, code reviews, and collaboration best practices.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'demo-memory-11', content: 'User is interested in performance optimization and frequently asks about React rendering, bundle size, and caching strategies.', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'demo-memory-12', content: 'User prefers practical examples over theoretical explanations and wants to see real-world use cases.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'demo-memory-13', content: 'User is exploring cloud platforms (AWS, Vercel, Railway) and needs guidance on deployment and infrastructure.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'demo-memory-14', content: 'User values code quality and best practices, often asking about testing, error handling, and code organization.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'demo-memory-15', content: 'User is building a real-time application and frequently discusses WebSockets, Server-Sent Events, and state synchronization.', timestamp: new Date().toISOString() },
  ]

  // Load saved items from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load system contexts
    const contextsJson = localStorage.getItem('Zplitgpt-contexts')
    if (contextsJson) {
      try {
        setSavedContexts(JSON.parse(contextsJson))
      } catch (e) {
        console.error('Failed to parse saved contexts', e)
        // If parsing fails, initialize with demo data
        const demoContexts = getDemoContexts()
        setSavedContexts(demoContexts)
        saveContextsToStorage(demoContexts)
      }
    } else {
      // Initialize with demo data if no saved contexts exist
      const demoContexts = getDemoContexts()
      setSavedContexts(demoContexts)
      saveContextsToStorage(demoContexts)
    }

    // Load chat memories
    const memoryKey = chatId ? `Zplitgpt-memories-${chatId}` : 'Zplitgpt-memories-default'
    const memoriesJson = localStorage.getItem(memoryKey)
    if (memoriesJson) {
      try {
        setSavedMemories(JSON.parse(memoriesJson))
      } catch (e) {
        console.error('Failed to parse saved memories', e)
        // If parsing fails, initialize with demo data
        const demoMemories = getDemoMemories()
        setSavedMemories(demoMemories)
        saveMemoriesToStorage(demoMemories)
      }
    } else {
      // Initialize with demo data if no saved memories exist
      const demoMemories = getDemoMemories()
      setSavedMemories(demoMemories)
      saveMemoriesToStorage(demoMemories)
    }
  }, [chatId, isOpen])

  const handleAddContext = () => {
    if (!newContextInput.trim()) return

    const newContext: SavedItem = {
      id: `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: newContextInput.trim(),
      timestamp: new Date().toISOString()
    }

    const updated = [newContext, ...savedContexts]
    setSavedContexts(updated)
    saveContextsToStorage(updated)
    setNewContextInput('')
    setShowNewContextInput(false)
  }

  const handleAddMemory = () => {
    if (!newMemoryInput.trim()) return

    const newMemory: SavedItem = {
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: newMemoryInput.trim(),
      timestamp: new Date().toISOString()
    }

    const updated = [newMemory, ...savedMemories]
    setSavedMemories(updated)
    saveMemoriesToStorage(updated)
    setNewMemoryInput('')
    setShowNewMemoryInput(false)
  }

  const handleDeleteContext = (id: string) => {
    const updated = savedContexts.filter(item => item.id !== id)
    setSavedContexts(updated)
    saveContextsToStorage(updated)
  }

  const handleDeleteMemory = (id: string) => {
    const updated = savedMemories.filter(item => item.id !== id)
    setSavedMemories(updated)
    saveMemoriesToStorage(updated)
  }

  const handleForgetAllContexts = () => {
    setSavedContexts([])
    saveContextsToStorage([])
  }

  const handleForgetAllMemories = () => {
    setSavedMemories([])
    saveMemoriesToStorage([])
  }

  const handleUseContext = (item: SavedItem) => {
    onContextChange(item.content)
    onSaveContext()
  }

  const handleUseMemory = (item: SavedItem) => {
    onMemoryChange(item.content)
    onSaveMemory()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-4xl h-[70vh] max-h-[70vh] bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] overflow-hidden flex flex-col p-0"
        showCloseButton={true}
      >
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b border-[#1a1a1a]">
          <DialogTitle className="text-[#f5f5f5] text-xl font-semibold">Saved Context & Memory</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'context' | 'memory')} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 pb-0">
            <TabsList className="w-full bg-[#1a1a1a] border border-[#333333] h-10 p-1">
              <TabsTrigger 
                value="context" 
                className="flex-1 data-[state=active]:bg-[#ff4f2b] data-[state=active]:text-white data-[state=active]:shadow-none text-[#b3b3b3] data-[state=inactive]:hover:text-[#f5f5f5]"
              >
                System Context
              </TabsTrigger>
              <TabsTrigger 
                value="memory"
                className="flex-1 data-[state=active]:bg-[#ff4f2b] data-[state=active]:text-white data-[state=active]:shadow-none text-[#b3b3b3] data-[state=inactive]:hover:text-[#f5f5f5]"
              >
                Chat Memory
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="context" className="flex-1 flex flex-col overflow-hidden mt-4 px-6 pb-6">
            <div className="flex-1 flex flex-col overflow-hidden">
              {showNewContextInput ? (
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333] space-y-3 mb-4">
                  <Textarea
                    value={newContextInput}
                    onChange={(e) => setNewContextInput(e.target.value)}
                    placeholder="Enter new system context..."
                    className="w-full bg-[#000000] border-[#333333] text-[#f5f5f5] placeholder-[#666666] resize-none focus:border-[#ff4f2b] min-h-[80px] text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddContext}
                      disabled={!newContextInput.trim()}
                      className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm h-9"
                    >
                      Add Context
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNewContextInput(false)
                        setNewContextInput('')
                      }}
                      variant="outline"
                      className="border-[#333333] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] text-sm h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowNewContextInput(true)}
                  variant="outline"
                  className="w-full border-[#333333] border-dashed text-[#b3b3b3] hover:text-[#ff4f2b] hover:border-[#ff4f2b] hover:bg-[#1a1a1a] text-sm h-10 mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New System Context
                </Button>
              )}

              <div className="flex-1 overflow-y-auto space-y-3">
                {savedContexts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333] flex items-start justify-between gap-3 group hover:border-[#444444] transition-colors"
                  >
                    <p className="text-[#f5f5f5] text-sm flex-1 leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleUseContext(item)}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Use
                      </Button>
                      <Button
                        onClick={() => handleDeleteContext(item.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#666666] hover:text-[#ff4f2b] hover:bg-[#2a2a2a]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {savedContexts.length === 0 && !showNewContextInput && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[#666666] text-sm">No saved system contexts yet</p>
                  </div>
                )}
              </div>

              {savedContexts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                  <Button
                    onClick={handleForgetAllContexts}
                    variant="destructive"
                    className="w-full bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm h-10"
                  >
                    Forget All Contexts
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="memory" className="flex-1 flex flex-col overflow-hidden mt-4 px-6 pb-6">
            <div className="flex-1 flex flex-col overflow-hidden">
              {showNewMemoryInput ? (
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333] space-y-3 mb-4">
                  <Textarea
                    value={newMemoryInput}
                    onChange={(e) => setNewMemoryInput(e.target.value)}
                    placeholder="Enter new chat memory..."
                    className="w-full bg-[#000000] border-[#333333] text-[#f5f5f5] placeholder-[#666666] resize-none focus:border-[#ff4f2b] min-h-[80px] text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddMemory}
                      disabled={!newMemoryInput.trim()}
                      className="bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm h-9"
                    >
                      Add Memory
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNewMemoryInput(false)
                        setNewMemoryInput('')
                      }}
                      variant="outline"
                      className="border-[#333333] text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] text-sm h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowNewMemoryInput(true)}
                  variant="outline"
                  className="w-full border-[#333333] border-dashed text-[#b3b3b3] hover:text-[#ff4f2b] hover:border-[#ff4f2b] hover:bg-[#1a1a1a] text-sm h-10 mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Chat Memory
                </Button>
              )}

              <div className="flex-1 overflow-y-auto space-y-3">
                {savedMemories.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333] flex items-start justify-between gap-3 group hover:border-[#444444] transition-colors"
                  >
                    <p className="text-[#f5f5f5] text-sm flex-1 leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleUseMemory(item)}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Use
                      </Button>
                      <Button
                        onClick={() => handleDeleteMemory(item.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#666666] hover:text-[#ff4f2b] hover:bg-[#2a2a2a]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {savedMemories.length === 0 && !showNewMemoryInput && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[#666666] text-sm">No saved chat memories yet</p>
                  </div>
                )}
              </div>

              {savedMemories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                  <Button
                    onClick={handleForgetAllMemories}
                    variant="destructive"
                    className="w-full bg-[#ff4f2b] hover:bg-[#ff6b4a] text-white text-sm h-10"
                  >
                    Forget All Memories
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
