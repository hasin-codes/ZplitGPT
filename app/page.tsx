'use client'

import { useState } from 'react'
import { TopBar } from '@/components/onedot2/TopBar'
import { LeftSidebar, Project, ChatHistory } from '@/components/onedot2/LeftSidebar'
import { CenterWorkspace } from '@/components/onedot2/CenterWorkspace'
import { AIInput } from '@/components/onedot2/AIInput'
import { SettingsModal } from '@/components/onedot2/SettingsModal'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function Home() {
  const [leftCollapsed, setLeftCollapsed] = useState(true) // Left sidebar always starts collapsed
  const [leftHovered, setLeftHovered] = useState(false)
  const [activeModels, setActiveModels] = useState(['gpt-3.5-turbo', 'claude-3-sonnet', 'gemini-pro', 'mistral-7b'])
  const [context, setContext] = useState('You are a helpful AI assistant that provides clear, accurate, and concise responses.')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  // Projects and Chats state
  const [projects, setProjects] = useState<Project[]>([
    { id: 'default', name: 'Default Workspace', lastModified: '2 hours ago' },
    { id: 'quantum-computing', name: 'Quantum Computing', lastModified: '1 day ago' },
    { id: 'api-design', name: 'API Design', lastModified: '3 days ago' },
    { id: 'code-review', name: 'Code Review', lastModified: '1 week ago' }
  ])
  
  const [chats, setChats] = useState<ChatHistory[]>([
    { id: 'chat-1', title: 'Quantum computing basics', timestamp: '10:30 AM' },
    { id: 'chat-2', title: 'React hooks optimization', timestamp: '9:45 AM' },
    { id: 'chat-3', title: 'Database schema design', timestamp: 'Yesterday' },
    { id: 'chat-4', title: 'TypeScript best practices', timestamp: 'Yesterday' },
    { id: 'chat-5', title: 'API authentication patterns', timestamp: '2 days ago' },
    { id: 'chat-6', title: 'Performance optimization', timestamp: '3 days ago' }
  ])
  
  const [selectedProject, setSelectedProject] = useState('default')
  const [selectedChat, setSelectedChat] = useState('chat-1')

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
    const newChat: ChatHistory = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      timestamp: 'Just now'
    }
    setChats(prev => [newChat, ...prev])
    setSelectedChat(newChat.id)
  }

  const handleChatRename = (chatId: string, name: string) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, title: name } : c
    ))
  }

  const handleChatNameUpdate = (chatId: string, name: string) => {
    // Update chat name based on first prompt
    const chat = chats.find(c => c.id === chatId)
    if (chat && chat.title === 'New Chat') {
      // Only update if it's still "New Chat"
      handleChatRename(chatId, name)
    }
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
          selectedChat={selectedChat}
          onProjectSelect={setSelectedProject}
          onChatSelect={setSelectedChat}
          onProjectCreate={handleProjectCreate}
          onChatCreate={handleChatCreate}
          onProjectRename={handleProjectRename}
          onChatRename={handleChatRename}
          onSettingsClick={handleSettingsOpen}
        />
      </SidebarProvider>

      {/* Main Content Area - Outside SidebarProvider */}
      <div 
        className="absolute inset-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          left: !leftHovered ? '64px' : '256px', // 64px when collapsed, 256px when hovered
          right: '0px'
        }}
      >
        <TopBar
          context={context}
          onContextChange={setContext}
          onSaveContext={handleSaveContext}
          activeModels={activeModels}
          onModelToggle={handleModelToggle}
        />
        <CenterWorkspace 
          leftCollapsed={leftCollapsed}
          activeModels={activeModels}
        />
        <AIInput 
          leftCollapsed={leftCollapsed}
          selectedChat={selectedChat}
          onChatNameUpdate={handleChatNameUpdate}
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
