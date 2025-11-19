'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Search, Sparkles, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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
        className="bg-neutral-950 border-neutral-800 text-neutral-100 overflow-hidden flex flex-col p-0 shadow-2xl sm:rounded-3xl"
        style={{
          width: '95vw',
          maxWidth: '900px',
          height: '80vh',
          maxHeight: '800px'
        }}
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-white">Context & Memory</DialogTitle>
              <p className="text-sm text-neutral-400 font-medium">Manage system contexts and chat memory</p>
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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'context' | 'memory')} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 pt-6 pb-0">
            <TabsList className="w-full bg-neutral-900/50 border border-neutral-800 h-12 p-1 rounded-xl">
              <TabsTrigger
                value="context"
                className="flex-1 rounded-lg data-[state=active]:bg-neutral-800 data-[state=active]:text-orange-500 data-[state=active]:shadow-sm text-neutral-400 hover:text-neutral-200 transition-all"
              >
                System Context
              </TabsTrigger>
              <TabsTrigger
                value="memory"
                className="flex-1 rounded-lg data-[state=active]:bg-neutral-800 data-[state=active]:text-blue-500 data-[state=active]:shadow-sm text-neutral-400 hover:text-neutral-200 transition-all"
              >
                Chat Memory
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="context" className="flex-1 flex flex-col overflow-hidden mt-0 px-8 pb-8 pt-6">
            <div className="flex-1 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {showNewContextInput ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-neutral-900 rounded-2xl p-4 border border-orange-500/20 shadow-lg shadow-orange-500/5 overflow-hidden mb-4"
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
                    className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-neutral-800 text-neutral-500 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 mb-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-neutral-900 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium">Create New Context</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                  {savedContexts.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors duration-200 hover:border-orange-500/30 hover:bg-orange-500/5"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed text-neutral-300 group-hover:text-orange-100 transition-colors">
                            {item.content}
                          </p>
                        </div>
                      </div>

                      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-900/90 rounded-lg p-1 border border-neutral-800">
                        <Button
                          onClick={() => handleUseContext(item)}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] font-medium text-neutral-500 hover:text-orange-400 hover:bg-orange-500/10"
                        >
                          Use
                        </Button>
                        <Button
                          onClick={() => handleDeleteContext(item.id)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {savedContexts.length === 0 && !showNewContextInput && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-neutral-600" />
                    </div>
                    <p className="text-neutral-500 text-sm">No saved system contexts yet</p>
                  </div>
                )}
              </div>

              {savedContexts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <Button
                    onClick={handleForgetAllContexts}
                    variant="ghost"
                    className="w-full text-neutral-500 hover:text-red-400 hover:bg-red-500/10 text-sm h-10"
                  >
                    Forget All Contexts
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="memory" className="flex-1 flex flex-col overflow-hidden mt-0 px-8 pb-8 pt-6">
            <div className="flex-1 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {showNewMemoryInput ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-neutral-900 rounded-2xl p-4 border border-blue-500/20 shadow-lg shadow-blue-500/5 overflow-hidden mb-4"
                  >
                    <Textarea
                      value={newMemoryInput}
                      onChange={(e) => setNewMemoryInput(e.target.value)}
                      placeholder="Enter a new chat memory..."
                      className="w-full bg-transparent border-none text-neutral-100 placeholder:text-neutral-600 resize-none focus:ring-0 min-h-[80px] text-sm p-0 leading-relaxed"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-neutral-800">
                      <Button
                        onClick={() => {
                          setShowNewMemoryInput(false)
                          setNewMemoryInput('')
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-neutral-400 hover:text-white hover:bg-white/5"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMemory}
                        disabled={!newMemoryInput.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      >
                        Add Memory
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowNewMemoryInput(true)}
                    className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-neutral-800 text-neutral-500 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 mb-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-neutral-900 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium">Create New Chat Memory</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                  {savedMemories.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors duration-200 hover:border-blue-500/30 hover:bg-blue-500/5"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed text-neutral-300 group-hover:text-blue-100 transition-colors">
                            {item.content}
                          </p>
                          <p className="text-[10px] text-neutral-600 mt-2 font-mono">
                            {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-900/90 rounded-lg p-1 border border-neutral-800">
                        <Button
                          onClick={() => handleUseMemory(item)}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] font-medium text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10"
                        >
                          Use
                        </Button>
                        <Button
                          onClick={() => handleDeleteMemory(item.id)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {savedMemories.length === 0 && !showNewMemoryInput && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-neutral-600" />
                    </div>
                    <p className="text-neutral-500 text-sm">No saved chat memories yet</p>
                  </div>
                )}
              </div>

              {savedMemories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <Button
                    onClick={handleForgetAllMemories}
                    variant="ghost"
                    className="w-full text-neutral-500 hover:text-red-400 hover:bg-red-500/10 text-sm h-10"
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
