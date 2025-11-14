'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/onedot2/TopBar'
import { LeftSidebar, Project, ChatHistory } from '@/components/onedot2/LeftSidebar'
import { CenterWorkspace } from '@/components/onedot2/CenterWorkspace'
import { SettingsModal } from '@/components/onedot2/SettingsModal'
import { SidebarProvider } from '@/components/ui/sidebar'
import AI_Prompt from '@/components/kokonutui/ai-prompt'
import { ExamplePromptCards } from '@/components/onedot2/ExamplePromptCards'
import { getChatHistory, createNewChat, updateChatTitle, initializeDemoChat, addMessageToChat } from '@/lib/chat-storage'
import type { Project } from '@/components/onedot2/LeftSidebar'

export default function Home() {
  const router = useRouter()
  const isDefaultState = true // Root page is always default state
  
  // Sidebar: expanded by default when in default state
  // Use localStorage to persist sidebar state, but default to expanded on default page
  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved !== null) {
        return saved === 'true'
      }
    }
    return false // Default to expanded on default page
  })
  const [leftHovered, setLeftHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Force sidebar to be collapsed on mobile
  useEffect(() => {
    if (isMobile) {
      setLeftCollapsed(true)
    }
  }, [isMobile])
  
  // Save sidebar state to localStorage when it changes (only on desktop)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobile) {
      localStorage.setItem('sidebar-collapsed', String(leftCollapsed))
    }
  }, [leftCollapsed, isMobile])
  
  // Update sidebar state when default state changes (with smooth transition) - only on desktop
  useEffect(() => {
    if (isDefaultState && !isMobile) {
      // Check if we're coming from a chat page (sidebar was collapsed)
      const wasCollapsed = leftCollapsed
      if (wasCollapsed) {
        // Add smooth transition
        setIsTransitioning(true)
        const timer = setTimeout(() => {
          setLeftCollapsed(false) // Expanded in default state
          setTimeout(() => setIsTransitioning(false), 300) // Clear transition flag after animation
        }, 100) // Small delay to allow page to render
        return () => clearTimeout(timer)
      }
    }
  }, [isDefaultState, leftCollapsed, isMobile])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const [activeModels, setActiveModels] = useState(['gpt-3.5-turbo', 'claude-3-sonnet', 'gemini-pro', 'mistral-7b'])
  const [context, setContext] = useState('You are a helpful AI assistant that provides clear, accurate, and concise responses.')
  const [memory, setMemory] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  // Projects and Chats state
  const [projects, setProjects] = useState<Project[]>([
    { id: 'default', name: 'Default Workspace', lastModified: '2 hours ago' },
    { id: 'quantum-computing', name: 'Quantum Computing', lastModified: '1 day ago' },
    { id: 'api-design', name: 'API Design', lastModified: '3 days ago' },
    { id: 'code-review', name: 'Code Review', lastModified: '1 week ago' }
  ])
  
  const [chats, setChats] = useState<ChatHistory[]>([])
  const [selectedProject, setSelectedProject] = useState('default')

  // Initialize demo chat and load chat history from storage
  useEffect(() => {
    // Initialize demo chat if it doesn't exist
    initializeDemoChat()
    
    // Load chat history
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
  }, [])

  const handleModelToggle = (modelId: string) => {
    setActiveModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const handleSaveContext = () => {
    localStorage.setItem('Zplitgpt-context', context)
    console.log('Context saved:', context)
  }

  const handleSaveMemory = () => {
    localStorage.setItem('Zplitgpt-memory-default', memory)
    console.log('Memory saved:', memory)
  }

  // Project handlers
  const handleProjectCreate = (name: string) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      lastModified: 'Just now'
    }
    setProjects(prev => [newProject, ...prev])
    setSelectedProject(newProject.id)
  }

  const handleProjectRename = (projectId: string, name: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name, lastModified: 'Just now' } : p
    ))
  }

  // Chat handlers
  const handleChatCreate = () => {
    // On default state, do nothing (button should be disabled)
    // This handler is kept for type safety but won't be called
  }

  // Handle message sent from ai-prompt component or example cards
  const handleMessageFromPrompt = (message: string) => {
    // Create a new chat
    const newChat = createNewChat()
    
    // Create message object
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const messageObj = {
      id: messageId,
      prompt: message,
      timestamp: now,
      modelResponses: {}
    }
    
    // Add message to chat (this will save the chat)
    addMessageToChat(newChat.id, messageObj)
    
    // Generate chat name from message
    const words = message.trim().split(/\s+/).slice(0, 4)
    let chatName = words.join(' ')
    if (chatName.length > 30) {
      chatName = chatName.substring(0, 27) + '...'
    }
    if (chatName) {
      updateChatTitle(newChat.id, chatName)
    }
    
    // Refresh chat history
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
    
    // Navigate to the new chat
    router.push(`/chat/${newChat.id}`)
  }

  const handleChatSelect = (chatId: string | null) => {
    if (chatId) {
      router.push(`/chat/${chatId}`)
    }
  }

  const handleChatRename = (chatId: string, name: string) => {
    updateChatTitle(chatId, name)
    // Refresh chat history
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
  }

  const handleProjectDelete = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
    if (selectedProject === projectId) {
      setSelectedProject('default')
    }
  }

  const handleProjectClone = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: `${project.name} (Copy)`,
        lastModified: 'Just now'
      }
      setProjects(prev => [newProject, ...prev])
      setSelectedProject(newProject.id)
    }
  }

  const handleChatDelete = (chatId: string) => {
    // Chat is already deleted by the component, just refresh the list
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
  }

  const handleChatClone = (chatId: string) => {
    // Chat is already cloned by the component, just refresh the list
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
  }

  const handleChatsUpdate = () => {
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
  }

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true)
  }

  const handleSettingsClose = () => {
    setIsSettingsOpen(false)
  }

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <SidebarProvider>
        {/* Left Sidebar */}
        <LeftSidebar
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed(!leftCollapsed)}
          onHoverChange={setLeftHovered}
          projects={projects}
          chats={chats}
          selectedProject={selectedProject}
          selectedChat={null}
          onProjectSelect={setSelectedProject}
          onChatSelect={handleChatSelect}
          onProjectCreate={handleProjectCreate}
          onChatCreate={handleChatCreate}
          onProjectRename={handleProjectRename}
          onChatRename={handleChatRename}
          onProjectDelete={handleProjectDelete}
          onProjectClone={handleProjectClone}
          onChatDelete={handleChatDelete}
          onChatClone={handleChatClone}
          onChatsUpdate={handleChatsUpdate}
          onSettingsClick={handleSettingsOpen}
          disableHoverBehavior={isDefaultState}
          disableNewChat={isDefaultState}
        />
      </SidebarProvider>

      {/* Main Content Area - Outside SidebarProvider */}
      <div 
        className="absolute inset-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          left: isMobile ? '0px' : (leftCollapsed ? '64px' : '256px'), // Mobile: no offset, Desktop: based on sidebar collapsed state
          right: '0px'
        }}
      >
        <TopBar
          context={context}
          onContextChange={setContext}
          onSaveContext={handleSaveContext}
          memory={memory}
          onMemoryChange={setMemory}
          onSaveMemory={handleSaveMemory}
          activeModels={activeModels}
          onModelToggle={handleModelToggle}
          onSidebarToggle={() => setLeftCollapsed(!leftCollapsed)}
        />
        {/* CenterWorkspace takes full remaining height */}
        <div className="flex-1 relative overflow-hidden">
          <CenterWorkspace 
            leftCollapsed={leftCollapsed}
            activeModels={activeModels}
          />
          {/* Progressive glass blur effect behind AI prompt - from bottom to 4-5px above AI prompt */}
          <div 
            className="absolute left-0 right-0 pointer-events-none z-[5]"
            style={{
              bottom: '0px',
              top: 'calc(100% - 100% + 180px)', // Approximately 4-5px above AI prompt component (pb-6=24px + pt-4=16px + component height ~140px = ~180px)
              background: 'transparent',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,0.95) 12%, rgba(0,0,0,0.88) 22%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.08) 92%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,0.95) 12%, rgba(0,0,0,0.88) 22%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.08) 92%, rgba(0,0,0,0) 100%)',
            }}
          />
          {/* Example Prompt Cards - centered on screen */}
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ paddingBottom: '180px', paddingTop: isMobile ? '40px' : '0px' }}>
            <ExamplePromptCards onCardClick={handleMessageFromPrompt} />
          </div>
          
          {/* Default state: Show ai-prompt component at bottom with proper gap - absolutely positioned */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-6 pt-4 z-10">
            <AI_Prompt onMessageSent={handleMessageFromPrompt} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />
    </div>
  )
}
