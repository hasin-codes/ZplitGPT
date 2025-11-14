'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/onedot2/TopBar'
import { LeftSidebar, ChatHistory } from '@/components/onedot2/LeftSidebar'
import type { Project } from '@/components/onedot2/LeftSidebar'
import { CenterWorkspace } from '@/components/onedot2/CenterWorkspace'
import { AIInput } from '@/components/onedot2/AIInput'
import { SettingsModal } from '@/components/onedot2/SettingsModal'
import { SidebarProvider } from '@/components/ui/sidebar'
import { 
  getAllChats, 
  getChatById, 
  createNewChat, 
  getChatHistory,
  updateChatTitle,
  initializeDemoChat,
  deleteChat,
  type ChatData 
} from '@/lib/chat-storage'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.chatId as string
  
  // Use localStorage to persist sidebar state, but default to collapsed on chat pages
  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved !== null) {
        return saved === 'true'
      }
    }
    return true // Default to collapsed on chat pages
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
  
  // On chat pages, ensure sidebar starts collapsed (with smooth transition) - only on desktop
  useEffect(() => {
    if (!isMobile) {
      // Check if we're coming from default page (sidebar was expanded)
      const wasExpanded = !leftCollapsed
      if (wasExpanded) {
        // Add smooth transition
        setIsTransitioning(true)
        const timer = setTimeout(() => {
          setLeftCollapsed(true) // Collapsed on chat pages
          setTimeout(() => setIsTransitioning(false), 300) // Clear transition flag after animation
        }, 100) // Small delay to allow page to render
        return () => clearTimeout(timer)
      }
    }
  }, [chatId, leftCollapsed, isMobile]) // Run when chatId changes
  const [activeModels, setActiveModels] = useState(['gpt-3.5-turbo', 'claude-3-sonnet', 'gemini-pro', 'mistral-7b'])
  const [context, setContext] = useState('You are a helpful AI assistant that provides clear, accurate, and concise responses.')
  const [memory, setMemory] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentChat, setCurrentChat] = useState<ChatData | null>(null)
  
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
    
    // Load chat history and remove empty chats
    const allChats = getAllChats()
    const emptyChatIds: string[] = []
    
    // Find empty chats
    allChats.forEach(chat => {
      if (chat.messages.length === 0) {
        emptyChatIds.push(chat.id)
      }
    })
    
    // Delete empty chats
    emptyChatIds.forEach(chatId => {
      deleteChat(chatId)
    })
    
    // Load updated chat history
    const history = getChatHistory()
    setChats(history.map(chat => ({
      id: chat.id,
      title: chat.title,
      timestamp: chat.timestamp
    })))
  }, [])

  // Function to refresh current chat from storage
  const refreshCurrentChat = useCallback(() => {
    if (chatId) {
      const chat = getChatById(chatId)
      if (chat) {
        // Check if chat is empty and delete it
        if (chat.messages.length === 0) {
          deleteChat(chatId)
          // Refresh chat history
          const history = getChatHistory()
          setChats(history.map(chat => ({
            id: chat.id,
            title: chat.title,
            timestamp: chat.timestamp
          })))
          // Navigate to home if current chat was deleted
          router.push('/')
          return
        }
        setCurrentChat(chat)
      } else {
        // Chat doesn't exist in storage - create a new unsaved chat object
        // This allows users to start typing before the chat is saved
        const now = new Date().toISOString()
        const unsavedChat: ChatData = {
          id: chatId,
          title: 'New Chat',
          timestamp: now,
          lastModified: now,
          messages: []
        }
        setCurrentChat(unsavedChat)
      }
      // Refresh chat history
      const history = getChatHistory()
      setChats(history.map(chat => ({
        id: chat.id,
        title: chat.title,
        timestamp: chat.timestamp
      })))
    }
  }, [chatId, router])

  // Load current chat
  useEffect(() => {
    refreshCurrentChat()
  }, [refreshCurrentChat])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
    localStorage.setItem(`Zplitgpt-memory-${chatId}`, memory)
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
    // Navigate to default screen (/) when new chat is clicked from a chat page
    router.push('/')
  }

  const handleChatSelect = (chatId: string | null) => {
    if (chatId) {
      router.push(`/chat/${chatId}`)
    } else {
      router.push('/')
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

  const handleChatNameUpdate = (chatId: string, name: string) => {
    if (currentChat && currentChat.title === 'New Chat') {
      updateChatTitle(chatId, name)
      setCurrentChat({ ...currentChat, title: name })
      // Refresh chat history
      const history = getChatHistory()
      setChats(history.map(chat => ({
        id: chat.id,
        title: chat.title,
        timestamp: chat.timestamp
      })))
    }
  }

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true)
  }

  const handleSettingsClose = () => {
    setIsSettingsOpen(false)
  }

  if (!currentChat) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-[#f5f5f5]">Loading...</div>
      </div>
    )
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
          selectedChat={chatId}
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
        />
      </SidebarProvider>

      {/* Main Content Area - Outside SidebarProvider */}
      <div 
        className="absolute inset-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          left: isMobile ? '0px' : (leftCollapsed ? '64px' : '256px'),
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
          chatId={chatId}
        />
        <CenterWorkspace 
          leftCollapsed={leftCollapsed}
          activeModels={activeModels}
          chatId={chatId}
          chatData={currentChat}
        />
        <AIInput 
          leftCollapsed={leftCollapsed}
          selectedChat={chatId}
          onChatNameUpdate={handleChatNameUpdate}
          context={context}
          onContextChange={setContext}
          onSaveContext={handleSaveContext}
          onMessageSent={refreshCurrentChat}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />
    </div>
  )
}

